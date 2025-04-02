terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # Use a recent version
    }
  }
  backend "s3" {
    bucket = "amazon-associates-terraform-state-bucket"  # Create this bucket in AWS
    key    = "lightsail/terraform.tfstate"
    region = "us-east-2"
  }
}
provider "aws" {
  
  # Terraform will use AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  region = "us-east-2"
}

# Variable for dynamic image tag
variable "image_tag" {
  description = "Docker image tag from pipeline"
  default     = "prod"  # Fallback for local runs
}

# Add variables for all env vars
variable "google_tag_manager_id" {
  description = "Google Tag Manager ID"
  type        = string
  default     = ""  # Default for local runs, overridden in pipeline
}

variable "git_hub_id" {
  description = "GitHub ID"
  type        = string
  default     = ""
}

variable "git_hub_secret" {
  description = "GitHub Secret"
  type        = string
  default     = ""
}

variable "nextauth_secret" {
  description = "NextAuth Secret"
  type        = string
  default     = ""
}

variable "nextauth_url" {
  description = "NextAuth URL"
  type        = string
  default     = ""
}

variable "next_public_api_base_url" {
  description = "Next Public API Base URL"
  type        = string
  default     = ""
}

variable "next_public_log_level" {
  description = "Next Public Log Level"
  type        = string
  default     = ""
}

variable "next_public_store_name" {
  description = "Next Public Store Name"
  type        = string
  default     = ""
}

variable "database_url" {
  description = "Database URL"
  type        = string
  default     = ""
}

resource "aws_lightsail_instance" "next_app" {
  tags = {
    Name = "next-app-instance"
  }
  name              = "next-app-instance"
  availability_zone = "us-east-2a"
  blueprint_id      = "ubuntu_20_04"
  bundle_id         = "nano_2_0"
  key_pair_name     = "NextAppKey"
  user_data         = <<-EOF
    #!/bin/bash
    set -x
    apt-get update 2>&1 | tee -a /var/log/user-data.log
    apt-get install -y docker.io awscli 2>&1 | tee -a /var/log/user-data.log
    systemctl enable docker 2>&1 | tee -a /var/log/user-data.log
    systemctl start docker 2>&1 | tee -a /var/log/user-data.log
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose 2>&1 | tee -a /var/log/user-data.log
    chmod +x /usr/local/bin/docker-compose 2>&1 | tee -a /var/log/user-data.log
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose 2>&1 | tee -a /var/log/user-data.log
    usermod -aG docker ubuntu 2>&1 | tee -a /var/log/user-data.log  # Add ubuntu to docker group
    mkdir -p /opt/next-app 2>&1 | tee -a /var/log/user-data.log
    chown ubuntu:ubuntu /opt/next-app 2>&1 | tee -a /var/log/user-data.log  # Set ownership
    cd /opt/next-app || { echo "Failed to cd into /opt/next-app" >> /var/log/user-data.log; exit 1; }
    echo "Writing docker-compose.yml..." >> /var/log/user-data.log
    cat << 'INNER_EOF' > docker-compose.yml 2>&1 | tee -a /var/log/user-data.log
    version: "3.8"
    services:
      app:
        image: ghcr.io/dorik84/amazon-affiliate-product-page:${var.image_tag}
        ports:
          - "3000:80"
        environment:
          - NODE_ENV=production
        restart: unless-stopped
    INNER_EOF
    chown ubuntu:ubuntu docker-compose.yml 2>&1 | tee -a /var/log/user-data.log  # Ensure ubuntu owns the file
    ls -la /opt/next-app >> /var/log/user-data.log
    echo '* * * * * root curl http://localhost:3000/api/health | aws cloudwatch put-metric-data --namespace "NextApp" --metric-name "HealthStatus" --value $([ $? -eq 0 ] && echo 1 || echo 0) --region us-east-2' > /etc/cron.d/health-check 2>&1 | tee -a /var/log/user-data.log
    sudo -u ubuntu docker-compose up -d 2>&1 | tee -a /var/log/user-data.log || echo "Docker Compose failed" >> /var/log/user-data.log
  EOF
}

resource "aws_lightsail_instance_public_ports" "next_app_ports" {
  instance_name = aws_lightsail_instance.next_app.name
  port_info {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
  }
  port_info {
    from_port   = 22  # Keep SSH open
    to_port     = 22
    protocol    = "tcp"
  }
  port_info {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda-lightsail-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lightsail:RebootInstance",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

# Lambda Function to Reboot Lightsail
resource "aws_lambda_function" "reboot_instance" {
  filename         = "lambda.zip"
  function_name    = "reboot_lightsail_instance"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("lambda.zip")
}

# Lambda Function Code (create this file locally as index.js, then zip it)
# index.js:
# const AWS = require('aws-sdk');
# const lightsail = new AWS.Lightsail();
# exports.handler = async () => {
#   await lightsail.rebootInstance({ instanceName: 'next-app-instance' }).promise();
#   return { status: 'Instance rebooted' };
# }
# Then: zip lambda.zip index.js

# SNS Topic for CloudWatch Alarm to Trigger Lambda
resource "aws_sns_topic" "health_alarm" {
  name = "next-app-health-alarm"
}

resource "aws_sns_topic_subscription" "lambda_subscription" {
  topic_arn = aws_sns_topic.health_alarm.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.reboot_instance.arn
}

resource "aws_lambda_permission" "sns_invoke" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.reboot_instance.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.health_alarm.arn
}

# CloudWatch Metric Alarm
resource "aws_cloudwatch_metric_alarm" "health_check" {
  alarm_name          = "next-app-health-failure"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthStatus"
  namespace           = "NextApp"
  period              = "60" # 1 minute
  statistic           = "Average"
  threshold           = "1"
  alarm_description   = "Triggers when health check fails"
  alarm_actions       = [aws_sns_topic.health_alarm.arn]
  treat_missing_data  = "breaching"
}


output "instance_ip" {
  value = aws_lightsail_instance.next_app.public_ip_address
}