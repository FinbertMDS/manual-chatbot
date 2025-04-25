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
    security_groups = [aws_security_group.alb_sg.id] 
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

terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}