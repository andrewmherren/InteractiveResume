variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "s3_region" {
  description = "AWS region for the existing S3 bucket"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the site (e.g., andrewherren.com)"
  type        = string
}

variable "bucket_name" {
  description = "Existing S3 bucket name (e.g., andrewherren.com)"
  type        = string
  default     = "andrewherren.com"
}
