output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = data.aws_s3_bucket.site_bucket.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for invalidations)"
  value       = aws_cloudfront_distribution.site_distribution.id
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.site_cert.arn
}

output "site_url" {
  description = "URL to access the site"
  value       = "https://${var.domain_name}"
}
