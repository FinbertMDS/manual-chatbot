output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.chatbot_backend.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.chatbot_backend.public_dns
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for frontend"
  value       = aws_s3_bucket.chatbot_frontend.bucket
}

output "s3_bucket_website_url" {
  description = "S3 static website endpoint (if enabled)"
  value       = "http://${aws_s3_bucket.chatbot_frontend.bucket}.s3-website-${var.region}.amazonaws.com"
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.chatbot_frontend_cdn.domain_name
}

output "cloudfront_url" {
  description = "Full CloudFront URL for the frontend"
  value       = "http://${aws_cloudfront_distribution.chatbot_frontend_cdn.domain_name}"
}

output "alb_http_url" {
  value = "http://${aws_lb.chatbot_alb.dns_name}"
  description = "ALB HTTPS URL"
}