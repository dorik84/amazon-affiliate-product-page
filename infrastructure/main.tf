terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "amazon-associates-terraform-state-bucket"
    key    = "lightsail/terraform.tfstate"
    region = "us-east-2"
  }
}

provider "aws" {
  region = "us-east-2"
}

# Variables (unchanged)
variable "image_tag" { description = "Docker image tag from pipeline"; default = "prod" }
variable "google_tag_manager_id" { description = "Google Tag Manager ID"; type = string; default = "" }
variable "git_hub_id" { description = "GitHub ID"; type = string; default = "" }
variable "git_hub_secret" { description = "GitHub Secret"; type = string; default = "" }
variable "nextauth_secret" { description = "NextAuth Secret"; type = string; default = "" }
variable "nextauth_url" { description = "NextAuth URL"; type = string; default = "" }
variable "next_public_api_base_url" { description = "Next Public API Base URL"; type = string; default = "" }
variable "next_public_log_level" { description = "Next Public Log Level"; type = string; default = "" }
variable "next_public_store_name" { description = "Next Public Store Name"; type = string; default = "" }
variable "database_url" { description = "Database URL"; type = string; default = "" }
variable "lets_encrypt_email" { description = "Email address for Let's Encrypt certificate notifications"; type = string; default = "default@example.com" }

# Lightsail Instance (unchanged)
resource "aws_lightsail_instance" "next_app" {
  tags = { Name = "next-app-instance" }
  name              = "next-app-instance"
  availability_zone = "us-east-2a"
  blueprint_id      = "ubuntu_22_04"
  bundle_id         = "nano_2_0"
  key_pair_name     = "NextAppKey"
  user_data         = <<-EOF
    #!/bin/bash
    set -x
    apt-get update 2>&1 | tee -a /var/log/user-data.log
    apt-get install -y docker.io awscli nginx certbot python3-certbot-nginx 2>&1 | tee -a /var/log/user-data.log
    systemctl enable docker 2>&1 | tee -a /var/log/user-data.log
    systemctl start docker 2>&1 | tee -a /var/log/user-data.log
    systemctl enable nginx 2>&1 | tee -a /var/log/user-data.log
    systemctl start nginx 2>&1 | tee -a /var/log/user-data.log
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose 2>&1 | tee -a /var/log/user-data.log
    chmod +x /usr/local/bin/docker-compose 2>&1 | tee -a /var/log/user-data.log
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose 2>&1 | tee -a /var/log/user-data.log
    usermod -aG docker ubuntu 2>&1 | tee -a /var/log/user-data.log
    cat << 'NGINX_EOF' > /etc/nginx/sites-available/best-choice.click 2>&1 | tee -a /var/log/user-data.log
    server {
        listen 80;
        server_name best-choice.click;
        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
    NGINX_EOF
    ln -sf /etc/nginx/sites-available/best-choice.click /etc/nginx/sites-enabled/ 2>&1 | tee -a /var/log/user-data.log
    systemctl restart nginx 2>&1 | tee -a /var/log/user-data.log
    certbot --nginx -n --agree-tos --email ${var.lets_encrypt_email} -d best-choice.click 2>&1 | tee -a /var/log/user-data.log
    mkdir -p /opt/next-app 2>&1 | tee -a /var/log/user-data.log
    chown ubuntu:ubuntu /opt/next-app 2>&1 | tee -a /var/log/user-data.log
    cd /opt/next-app || { echo "Failed to cd into /opt/next-app" >> /var/log/user-data.log; exit 1; }
    echo "Writing docker-compose.yml..." >> /var/log/user-data.log
    cat << 'INNER_EOF' > docker-compose.yml 2>&1 | tee -a /var/log/user-data.log
    version: "3.8"
    services:
      app:
        image: ghcr.io/dorik84/amazon-affiliate-product-page:${var.image_tag}
        ports:
          - "3000:3000"
        environment:
          - NODE_ENV=production
          - GIT_HUB_ID=${var.git_hub_id}
          - GIT_HUB_SECRET=${var.git_hub_secret}
          - NEXTAUTH_SECRET=${var.nextauth_secret}
          - NEXTAUTH_URL=${var.nextauth_url}
          - NEXT_PUBLIC_API_BASE_URL=${var.next_public_api_base_url}
        restart: unless-stopped
    INNER_EOF
    chown ubuntu:ubuntu docker-compose.yml 2>&1 | tee -a /var/log/user-data.log
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
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
  }
  port_info {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }
}

resource "aws_route53_record" "best_choice_click_a" {
  zone_id = "Z07095402QPZ2E2HYCD5J"
  name    = "best-choice.click"
  type    = "A"
  ttl     = 300
  records = [aws_lightsail_instance.next_app.public_ip_address]
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda-lightsail-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
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


# Lambda Function Code (create this file locally as index.js, then zip it)
# index.js:
# const AWS = require('aws-sdk');
# const lightsail = new AWS.Lightsail();
# exports.handler = async () => {
#   await lightsail.rebootInstance({ instanceName: 'next-app-instance' }).promise();
#   return { status: 'Instance rebooted' };
# }
# Then: zip lambda.zip index.js
# IAM Policy for amazon_associate_account
resource "aws_iam_user_policy" "amazon_associate_policy" {
  name   = "AmazonAssociatePipelinePolicy"
  user   = "amazon_associate_account"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::amazon-associates-terraform-state-bucket",
          "arn:aws:s3:::amazon-associates-terraform-state-bucket/*"
        ]
      },
      {
        Effect = "Allow"
        Action = "lightsail:*"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "route53:GetHostedZone",
          "route53:ChangeResourceRecordSets",
          "route53:ListHostedZones",
          "route53:ListResourceRecordSets"
        ]
        Resource = "arn:aws:route53:::hostedzone/Z07095402QPZ2E2HYCD5J"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:GetRole",
          "iam:CreateRole",
          "iam:UpdateRole",
          "iam:DeleteRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:PassRole"
        ]
        Resource = "arn:aws:iam::027569700913:role/*"
      },
      {
        Effect = "Allow"
        Action = "sns:*"
        Resource = "arn:aws:sns:us-east-2:027569700913:*"
      },
      {
        Effect = "Allow"
        Action = "lambda:*"
        Resource = "arn:aws:lambda:us-east-2:027569700913:function:*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:us-east-2:027569700913:*"
      }
    ]
  })
}

# SNS Topic and other resources (unchanged)
resource "aws_sns_topic" "health_alarm" {
  name = "next-app-health-alarm"
}

resource "aws_lambda_function" "reboot_instance" {
  filename         = "lambda.zip"
  function_name    = "reboot_lightsail_instance"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("lambda.zip")
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

resource "aws_cloudwatch_metric_alarm" "memory_high" {
  alarm_name          = "next-app-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/Lightsail"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Triggers when memory exceeds 80%"
  alarm_actions       = [aws_sns_topic.health_alarm.arn]
  dimensions = {
    InstanceName = aws_lightsail_instance.next_app.name
  }
}

resource "aws_cloudwatch_metric_alarm" "health_check" {
  alarm_name          = "next-app-health-failure"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthStatus"
  namespace           = "NextApp"
  period              = "60"
  statistic           = "Average"
  threshold           = "1"
  alarm_description   = "Triggers when health check fails"
  alarm_actions       = [aws_sns_topic.health_alarm.arn]
  treat_missing_data  = "breaching"
}

output "instance_ip" {
  value = aws_lightsail_instance.next_app.public_ip_address
}