terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # S3 backend for state management
  # The state is stored in the dedicated tf.andrewherren.com bucket under /terraform/terraform.tfstate
  # This is safe for static site infrastructure with no sensitive data
  backend "s3" {
    bucket         = "tf.andrewherren.com"
    key            = "terraform/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Interactive Resume"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

provider "aws" {
  alias  = "s3"
  region = var.s3_region

  default_tags {
    tags = {
      Project     = "Interactive Resume"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
