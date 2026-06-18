# BootSignal Frontend S3/CloudFront Deployment

## Architecture

```text
GitHub frontend repository
  -> CodePipeline
  -> CodeBuild
  -> S3 static website bucket
  -> CloudFront
```

## Required AWS Resources

- S3 bucket for the built frontend.
- CloudFront distribution pointing to the S3 bucket.
- CodeBuild project connected to this repository.
- CodePipeline with GitHub source and CodeBuild build stage.

## CodeBuild Environment Variables

Set these in the CodeBuild project.

```text
S3_BUCKET=<frontend-s3-bucket-name>
VITE_API_BASE_URL=https://team5-bootsignal-prod.ap-northeast-2.elasticbeanstalk.com
CLOUDFRONT_DISTRIBUTION_ID=<cloudfront-distribution-id>
```

`CLOUDFRONT_DISTRIBUTION_ID` is optional. If it is empty, the build still deploys to S3 but skips cache invalidation.

## CodeBuild Permissions

The CodeBuild service role needs:

- Read access to the GitHub source through CodePipeline.
- Write access to the frontend S3 bucket.
- CloudFront invalidation permission if `CLOUDFRONT_DISTRIBUTION_ID` is set.

For quick school-project setup, `AmazonS3FullAccess` plus a CloudFront invalidation policy is acceptable. Later, reduce permissions to the specific bucket and distribution.

## Pipeline

Create a pipeline with:

1. Source: GitHub frontend repository.
2. Build: CodeBuild project using `buildspec.yml`.

The `buildspec.yml` runs:

```bash
npm ci
npm run build
aws s3 sync dist/ s3://$S3_BUCKET --delete
```

Then it invalidates CloudFront if a distribution id is configured.
