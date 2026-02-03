output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.resume_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for invalidations)"
  value       = aws_cloudfront_distribution.resume_distribution.id
}

output "s3_bucket_name" {
  description = "S3 bucket name for resume assets"
  value       = aws_s3_bucket.resume_bucket.id
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.resume_cert.arn
}

output "site_url" {
  description = "URL to access the resume"
  value       = "https://${var.domain_name}"
}
