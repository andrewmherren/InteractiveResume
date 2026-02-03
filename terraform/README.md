# Terraform Deployment Guide

This Terraform configuration deploys the Interactive Resume to AWS with HTTPS via CloudFront and S3.

## Prerequisites

1. **AWS Account** with the `andrewherren.com` domain already registered in Route53
2. **Terraform** installed (v1.0+)
3. **AWS CLI** configured with appropriate credentials
4. **Built site** - Run `npm run build` to generate the `dist/` directory

## Resources Created

- **S3 Bucket** - Static file hosting (encrypted, versioned, non-public)
- **CloudFront Distribution** - CDN with HTTPS, caching, and SPA routing
- **ACM Certificate** - Free TLS certificate via AWS Certificate Manager
- **Route53 DNS Records** - Points domain to CloudFront
- **CloudFront Origin Access Identity** - Secure S3 access

## Deployment Steps

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Review the Plan

```bash
terraform plan
```

Verify all resources look correct (should show ~10 resources being created).

### 3. Apply Configuration

```bash
terraform apply
```

Confirm by typing `yes`. This takes ~5-10 minutes (CloudFront deployment is slower).

### 4. Upload Site Files

After Terraform completes, upload your built site:

```bash
aws s3 sync ../dist/ s3://$(terraform output -raw s3_bucket_name) --delete
```

### 5. Invalidate CloudFront Cache

After uploading, invalidate CloudFront to ensure fresh content:

```bash
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

### 6. Verify

Visit `https://andrewherren.com` - it should load your resume!

## File Structure

```
terraform/
├── provider.tf       # AWS provider configuration
├── variables.tf      # Variable definitions
├── main.tf          # Core resources (S3, CloudFront, ACM, Route53)
├── outputs.tf       # Output values
├── terraform.tfvars # Variables (domain name)
└── README.md        # This file
```

## Configuration

Edit `terraform.tfvars` to customize:

```hcl
domain_name = "andrewherren.com"  # Your domain (must exist in Route53)
```

## Updating the Site

After making changes to your resume:

1. Build: `npm run build`
2. Sync: `aws s3 sync dist/ s3://YOUR-BUCKET-NAME --delete`
3. Invalidate: `aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"`

## State Management (Optional)

To store Terraform state in S3 (recommended for production):

1. Create an S3 bucket and DynamoDB table for locking
2. Uncomment the `backend` block in `provider.tf`
3. Update with your bucket/table names
4. Run `terraform init` again

## Cleanup

To destroy all resources (WARNING: This deletes your site):

```bash
terraform destroy
```

## Troubleshooting

**Certificate validation fails:**
- Ensure your domain exists in Route53
- Verify Route53 records for DNS validation

**CloudFront returns 403 Forbidden:**
- Check S3 bucket policy was created
- Verify Origin Access Identity (OAI) was applied

**DNS not resolving:**
- CloudFront can take 5-10 minutes to deploy fully
- Check Route53 records point to CloudFront domain

**404 errors on refresh:**
- Verify custom error responses redirect to `index.html`
- Check CloudFront default root object is `index.html`

## Cost Estimates

- **S3 Storage**: ~$0.023/GB/month (typically < $1/month for a resume site)
- **CloudFront**: ~$0.085/GB (usually < $1/month for typical traffic)
- **Route53**: $0.50/month for hosted zone
- **ACM Certificate**: Free

**Total: ~$1-2/month** depending on traffic.
