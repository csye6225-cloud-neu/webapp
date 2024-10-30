import { S3Client } from "@aws-sdk/client-s3";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";

export const s3Client = new S3Client({});

export const cloudwatch = new CloudWatchClient({});