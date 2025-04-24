provider "aws" {
  region = var.region
}

resource "aws_instance" "chatbot_backend" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
  tags          = var.tags
  user_data     = file("${path.module}/user_data.sh")
  vpc_security_group_ids = [aws_security_group.chatbot_sg.id]
}

resource "aws_security_group" "chatbot_sg" {
  name        = "chatbot_sg"
  description = "Allow HTTP and SSH"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "chatbot-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}

resource "aws_apigatewayv2_integration" "http_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "HTTP_PROXY"
  integration_method = "ANY"
  integration_uri  = "http://${aws_instance.chatbot_backend.public_ip}:3001"
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.http_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}


terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}