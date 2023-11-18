import { S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { streamToString } from '@/_core/utils/stream-to-string';

const s3Client = new S3Client({});

export const handler = async (event: S3Event): Promise<void> => {
	console.log('S3EVENT', event);
};
