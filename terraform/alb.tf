# ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "alb_sg"
  description = "Allow HTTPS access to ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
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

# Application Load Balancer
resource "aws_lb" "chatbot_alb" {
  name               = "chatbot-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = ["subnet-04ef2cc9e4faee6d6", "subnet-08e2b138afabde49e", "subnet-0b0dbf0e6e6776e00"]
  tags               = var.tags
}

# Target Group (EC2 backend port 3001)
resource "aws_lb_target_group" "chatbot_tg" {
  name        = "chatbot-tg"
  port        = 3001
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = data.aws_vpc.default.id

  health_check {
    path                = "/health"
    port                = "3001"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = var.tags
}

# Attach EC2 instance to target group
resource "aws_lb_target_group_attachment" "chatbot_attach" {
  target_group_arn = aws_lb_target_group.chatbot_tg.arn
  target_id        = aws_instance.chatbot_backend.id
  port             = 3001
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.chatbot_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.chatbot_tg.arn
  }
}

# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.chatbot_alb.arn
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_certificate_arn = aws_acm_certificate.cert.arn

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.chatbot_tg.arn
#   }
# }

resource "aws_acm_certificate" "cert" {
  domain_name       = "finbertngo.com"         # ví dụ: chatbot.yourdomain.com
  validation_method = "DNS"

  tags = {
    Name = "my-onamae-cert"
  }
}

output "acm_validation_record" {
  value = {
    name  = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_name
    type  = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_type
    value = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_value
  }
}
