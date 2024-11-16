import { S3Client } from "@aws-sdk/client-s3";
import { SNSClient } from "@aws-sdk/client-sns";


export const s3Client = new S3Client({});
export const snsClient = new SNSClient({});