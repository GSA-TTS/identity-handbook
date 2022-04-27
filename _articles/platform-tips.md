---
title: "Platform Tips and Tricks"
description: Helpful tips for AWS, Terraform, and other platform related tech
layout: article
category: Platform
---


# AWS

## Deleting a Versioned Bucket

You cannot delete a bucket with versioned objects in it until all of the versions are removed, so first you have to delete the versions.

```sh
# set the bucket
export bucket_name="<some-bucket>"

# delete the versions.
aws s3api delete-objects \
    --bucket "${bucket_name}" \
    --delete "$(aws s3api list-object-versions \
    --bucket "${bucket_name}" \
    --output=json \
    --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}')"

# delete the bucket.
aws s3 rb "s3://${bucket_name}"

# unset
unset $bucket_name
```

## Scope - Universal vs. Account Global vs. Regional vs. AZ Resources

As you plan the addition of a new resource, or refactor code for an existing one,
carefully consider the scope of the resource.

Example: IAM Roles are global to an AWS account, so they do not need to be created
again in a new region.   S3 buckets are regional so you would want to create
a given bucket in a new region.


| Category                       | Terraform Resource(s)                     | Scope     | Notes                                                                                                                 |
|--------------------------------|-------------------------------------------|:---------:|-----------------------------------------------------------------------------------------------------------------------|
| ACM                            | aws_acm_certificate*                      | region    |                                                                                                                       |
| ALB/ELB/LB                     | aws_alb*, aws_elb*, aws_lb*               | region    |                                                                                                                       |
| AutoScaling Group (ASG)        | aws_autoscaling*                          | region    |                                                                                                                       |
| CloudFront                     | aws_cloudfront*                           | global    |                                                                                                                       |
| CloudTrail                     | aws_cloudtrail*                           | global    |                                                                                                                       |
| CloudWatch Dashboard           | aws_cloudwatch_dashboard                  | global    |                                                                                                                       |
| CloudWatch Event               | aws_cloudwatch_event*                     | region    |                                                                                                                       |
| CloudWatch Log Destination     | aws_cloudwatch_log_destination*           | region    |                                                                                                                       |
| CloudWatch Log Group           | aws_cloudwatch_log_group                  | region    |                                                                                                                       |
| CloudWatch Metric Alarm        | aws_cloudwatch_metric_alarm               | region    |                                                                                                                       |
| Config                         | aws_config*                               | region    |                                                                                                                       |
| RDS                            | aws_db*                                   | region    |                                                                                                                       |
| DynamoDB                       | aws_dynamodb*                             | region    |                                                                                                                       |
| ElastiCache                    | aws_elasticache*                          | region    |                                                                                                                       |
| EC2                            |                                           |   az      | See [AWS: EC2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ami)                       |
| Flow Log                       | aws_flow_log*                             | region    |                                                                                                                       |
| IAM                            | aws_iam*                                  | global    |                                                                                                                       |
| Internet Gateway               | aws_internet_gateway                      | region    |                                                                                                                       |
| Kinesis                        | aws_kinesis*                              | region    |                                                                                                                       |
| KMS                            | aws_kms*                                  | region    |                                                                                                                       |
| Lambda                         | aws_lambda*                               | region    |                                                                                                                       |
| Network ACL                    | aws_network_acl*, aws_default_network_acl | region    |                                                                                                                       |
| Pinpoint App                   | aws_pinpoint_app                          | region    | A.K.A. "Pinpoint Project"                                                                                             |
| Pinpoint SMS Channel           | aws_pinpoint_sms_channel                  | region    |                                                                                                                       |
| Redshift                       | aws_reshift*                              | region    |                                                                                                                       |
| Route53                        | aws_route53*                              | global    |                                                                                                                       |
| Route53 Public Zone            | aws_route53_zone                          | universal | Public DNS zones must be universally unique                                                                           |
| Route Table                    | aws_route_table*                          | region    |                                                                                                                       |
| S3 Account Public Access Block | aws_s3_account_public_access_block        | global    |                                                                                                                       |
| S3 Bucket Resource             | aws_s3_bucket*                            | region    | Buckets are regional, but the names are universal                                                                     |
| S3 Bucket Name                 | n/a                                       | universal | [Buckets names are universally unique!](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) |
| Security Group                 | aws_security_group                        | region    |                                                                                                                       |
| SES                            | aws_ses*                                  | region    |                                                                                                                       |
| SNS                            | aws_sns*                                  | region    |                                                                                                                       |
| SQS                            | aws_sqs*                                  | region    |                                                                                                                       |
| Subnet                         | aws_subnet                                |   az      |                                                                                                                       |
| VPC                            | aws_vpc*                                  | region    |                                                                                                                       |
| WAF Regional                   | aws_wafregional*                          | region    |                                                                                                                       |

This is not guaranteed accurate!  Update incorrect information and add specific
resources that have differing scope.

Note that "universal" is simplified.  Items marked "universal" must
be unique [per-partition](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#arns-syntax).

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/resources.html provides some of the
above info for EC2 resources, but if you find a wholistic list add it here!
