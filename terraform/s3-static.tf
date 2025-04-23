resource "aws_s3_bucket" "chatbot_frontend" {
  bucket = var.s3_bucket_name
  force_destroy = true
  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "frontend_access_block" {
  bucket = aws_s3_bucket.chatbot_frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "chatbot_frontend_policy" {
  bucket = aws_s3_bucket.chatbot_frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.chatbot_frontend.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "chatbot_frontend_cdn" {
  origin {
    domain_name = aws_s3_bucket.chatbot_frontend.bucket_regional_domain_name
    origin_id   = "frontendS3Origin"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "frontendS3Origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.tags
}
