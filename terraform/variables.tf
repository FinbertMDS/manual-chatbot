variable "region" {
  default = "ap-northeast-1" # Tokyo
}

variable "instance_type" {
  default = "t2.micro" # Free tier eligible
}

variable "ami_id" {
  # Amazon Linux 2 - Free Tier eligible (Tokyo)
  default = "ami-05206bf8aecfc7ae6"
}

variable "key_name" {
  description = "EC2 Key Pair for SSH access"
  default     = "my-key" # Thay bằng tên thực tế
}

variable "s3_bucket_name" {
  default = "manual-chatbot-frontend"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Name        = "manual-chatbot-ec2"
    Environment = "dev"
    Project     = "manual-chatbot"
  }
}