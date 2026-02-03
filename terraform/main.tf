# S3 bucket for hosting static resume files
resource "aws_s3_bucket" "resume_bucket" {
  bucket = replace("${var.domain_name}-resume", ".", "-")
}

# Block all public access (CloudFront will access via OAI)
resource "aws_s3_bucket_public_access_block" "resume_bucket" {
  bucket = aws_s3_bucket.resume_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for safety
resource "aws_s3_bucket_versioning" "resume_bucket" {
  bucket = aws_s3_bucket.resume_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "resume_bucket" {
  bucket = aws_s3_bucket.resume_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudFront Origin Access Identity for S3
resource "aws_cloudfront_origin_access_identity" "resume_oai" {
  comment = "OAI for resume S3 bucket"
}

# S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "resume_bucket" {
  bucket = aws_s3_bucket.resume_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontAccess"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.resume_oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.resume_bucket.arn}/*"
      }
    ]
  })
}

# ACM Certificate (must be in us-east-1 for CloudFront)
resource "aws_acm_certificate" "resume_cert" {
  domain_name       = var.domain_name
  subject_alternative_names = var.enable_www_redirect ? ["www.${var.domain_name}"] : []
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Get the Route53 hosted zone for the domain
data "aws_route53_zone" "resume_zone" {
  name = var.domain_name
}

# DNS validation records for ACM certificate
resource "aws_route53_record" "resume_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.resume_cert.domain_validation_options : dvo.domain => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.resume_zone.zone_id
}

# Validate ACM certificate
resource "aws_acm_certificate_validation" "resume_cert" {
  certificate_arn           = aws_acm_certificate.resume_cert.arn
  timeouts {
    create = "5m"
  }
  depends_on = [aws_route53_record.resume_cert_validation]
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "resume_distribution" {
  enabled = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.resume_bucket.bucket_regional_domain_name
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.resume_oai.cloudfront_access_identity_path
    }
  }

  # Main distribution domain
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Cache behavior for versioned assets (long TTL)
  cache_behavior {
    path_pattern     = "*.js"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 31536000
    max_ttl                = 31536000
    compress               = true
  }

  cache_behavior {
    path_pattern     = "*.css"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 31536000
    max_ttl                = 31536000
    compress               = true
  }

  # Error handling - redirect 404 to index.html for SPA
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  aliases = var.enable_www_redirect ? [var.domain_name, "www.${var.domain_name}"] : [var.domain_name]

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.resume_cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  depends_on = [aws_acm_certificate_validation.resume_cert]
}

# Route53 DNS records pointing to CloudFront
resource "aws_route53_record" "resume_apex" {
  zone_id = data.aws_route53_zone.resume_zone.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.resume_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.resume_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# Optional: www subdomain redirect
resource "aws_route53_record" "resume_www" {
  count   = var.enable_www_redirect ? 1 : 0
  zone_id = data.aws_route53_zone.resume_zone.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.resume_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.resume_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
