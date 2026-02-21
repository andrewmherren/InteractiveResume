# Terraform Deployment Guide

This configuration deploys your Interactive Resume to AWS at the root of andrewherren.com using CloudFront + S3.

## Prerequisites

- Terraform v1.0+
- AWS CLI configured with your profile (`personal`)
- Built site: `npm run build`

## State Backend

State location: `s3://tf.andrewherren.com/terraform/terraform.tfstate`

If you are setting up a new environment, create the state bucket in `us-west-2`, enable versioning/encryption, block public access, then run:

```bash
AWS_PROFILE=personal terraform init -reconfigure
```

## Deploy / Update

```bash
# Apply infra changes
AWS_PROFILE=personal terraform apply

# Upload the built site to the bucket root
AWS_PROFILE=personal aws s3 sync ../dist/ s3://andrewherren.com --delete

# Invalidate CloudFront cache
AWS_PROFILE=personal aws cloudfront create-invalidation \
  --distribution-id $(AWS_PROFILE=personal terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

## App Updates (Content Only)

When you make changes to the app and want to deploy them without modifying infrastructure:

```bash
# 1. Build the app
npm run build

# 2. Upload to S3 (from the terraform directory)
AWS_PROFILE=personal aws s3 sync ../dist/ s3://andrewherren.com --delete

# 3. Invalidate CloudFront cache to serve fresh content
AWS_PROFILE=personal aws cloudfront create-invalidation \
  --distribution-id $(AWS_PROFILE=personal terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

The `--delete` flag removes files from S3 that no longer exist in the build. The CloudFront invalidation typically completes in 1-2 minutes.

## Verify

- https://andrewherren.com
- https://www.andrewherren.com

## Configuration

```hcl
domain_name = "andrewherren.com"
bucket_name = "andrewherren.com"
s3_region = "us-west-2"
```

## Troubleshooting

**"No valid credential sources found"**
- Confirm the profile has keys: `AWS_PROFILE=personal aws sts get-caller-identity`

**"S3 bucket either doesn't exist or you don't have permission"**
- Verify: `AWS_PROFILE=personal aws s3 ls s3://andrewherren.com/`

**CloudFront invalidation fails**
- Confirm outputs: `AWS_PROFILE=personal terraform output`

## Cleanup

```bash
AWS_PROFILE=personal terraform destroy
```

This deletes CloudFront, ACM, and Route53 records, but keeps the S3 bucket.