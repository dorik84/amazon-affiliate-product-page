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

# Lightsail Instance
resource "aws_lightsail_instance" "next_app" {
  name              = "next-app-instance"
  availability_zone = "us-east-2a"
  blueprint_id      = "ubuntu_20_04"
  bundle_id         = "nano_2_0"
  key_pair_name     = "NextAppKey"  # Custom key pair created in Lightsail
  user_data         = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io docker-compose awscli
    systemctl enable docker
    systemctl start docker
    mkdir -p /opt/next-app
    cd /opt/next-app
    echo '${file("docker-compose.yml")}' > docker-compose.yml
    # Install AWS CLI and push health check metric
    echo '* * * * * root curl http://localhost:3000/api/health | aws cloudwatch put-metric-data --namespace "NextApp" --metric-name "HealthStatus" --value $([ $? -eq 0 ] && echo 1 || echo 0) --region us-east-2' > /etc/cron.d/health-check
    docker-compose up -d
  EOF
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