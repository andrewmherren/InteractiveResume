# ============================================================================
# EXISTING RESOURCE: S3 Bucket
# ============================================================================
# Your bucket already exists from manual AWS console setup
# This data source references it instead of creating a new one
# See README.md "Migration Steps" for import instructions if you have
# multiple buckets and need to specify which one
data "aws_s3_bucket" "site_bucket" {
  provider = aws.s3
  bucket = var.bucket_name
}

# Enable versioning for safety
resource "aws_s3_bucket_versioning" "site_bucket" {
  provider = aws.s3
  bucket = data.aws_s3_bucket.site_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "site_bucket" {
  provider = aws.s3
  bucket = data.aws_s3_bucket.site_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access (CloudFront will access via OAI)
resource "aws_s3_bucket_public_access_block" "site_bucket" {
  provider = aws.s3
  bucket = data.aws_s3_bucket.site_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================================================
# CloudFront Origin Access Identity for S3
# ============================================================================
resource "aws_cloudfront_origin_access_identity" "site_oai" {
  comment = "OAI for andrewherren.com"
}

# S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "site_bucket" {
  provider = aws.s3
  bucket = data.aws_s3_bucket.site_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CloudFrontAccess"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.site_oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${data.aws_s3_bucket.site_bucket.arn}/*"
      }
    ]
  })
}

# ============================================================================
# ACM Certificate (must be in us-east-1 for CloudFront)
# ============================================================================
# Note: If you have an existing certificate, see README.md for import instructions
resource "aws_acm_certificate" "site_cert" {
  domain_name              = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method        = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Get the Route53 hosted zone for the domain
data "aws_route53_zone" "site_zone" {
  name = var.domain_name
}

# DNS validation records for ACM certificate
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site_cert.domain_validation_options : dvo.domain_name => {
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
  zone_id         = data.aws_route53_zone.site_zone.zone_id
}

# Validate ACM certificate
resource "aws_acm_certificate_validation" "site_cert" {
  certificate_arn = aws_acm_certificate.site_cert.arn
  timeouts {
    create = "5m"
  }
  depends_on = [aws_route53_record.cert_validation]
}

# ============================================================================
# CloudFront Distribution
# ============================================================================
resource "aws_cloudfront_distribution" "site_distribution" {
  enabled             = true
  default_root_object = "index.html"
  is_ipv6_enabled     = true

  origin {
    domain_name = data.aws_s3_bucket.site_bucket.bucket_regional_domain_name
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.site_oai.cloudfront_access_identity_path
    }
  }

  # Default behavior for HTML/index.html (shorter cache)
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

  # Cache behavior for versioned JavaScript assets (long TTL)
  ordered_cache_behavior {
    path_pattern     = "assets/*.js"
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
    default_ttl            = 31536000  # 1 year - these are versioned by Vite
    max_ttl                = 31536000
    compress               = true
  }

  # Cache behavior for CSS (long TTL)
  ordered_cache_behavior {
    path_pattern     = "assets/*.css"
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

  # Cache behavior for teaser assets (includes worklets, wasm, pck)
  ordered_cache_behavior {
    path_pattern     = "teaser/*"
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
    default_ttl            = 86400  # 1 day for teaser assets
    max_ttl                = 604800 # 1 week
    compress               = true
  }

  # Error handling - redirect 404/403 to index.html for SPA
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

  aliases = [var.domain_name, "www.${var.domain_name}"]

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site_cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  depends_on = [aws_acm_certificate_validation.site_cert]
}

# ============================================================================
# Route53 DNS Records pointing to CloudFront
# ============================================================================
# Root domain
resource "aws_route53_record" "site_apex" {
  zone_id = data.aws_route53_zone.site_zone.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.site_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# www subdomain
resource "aws_route53_record" "site_www" {
  zone_id = data.aws_route53_zone.site_zone.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.site_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
