variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the resume site (must already exist in Route53)"
  type        = string
}

variable "enable_www_redirect" {
  description = "Enable redirect from www to non-www"
  type        = bool
  default     = true
}
