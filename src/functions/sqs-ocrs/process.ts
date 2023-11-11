import { SQSEvent } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { infraestructureErrors } from '@/_core/configs/errorConstants';

const s3Client = new S3Client({});
const dynamoDBClient = new DynamoDBClient({});

export const handler = async (event: SQSEvent): Promise<void> => {
	const dynamoTableName = process.env.AWS_TABLA_DYNAMO_SQS_OCRS;

	if (!dynamoTableName) {
		throw new Error(
			infraestructureErrors.ENVIRONMENT_VARIABLE_NOT_FOUND(
				'AWS_TABLA_DYNAMO_SQS_OCRS'
			)
		);
	}

	for (const record of event.Records) {
		const { bucket, baseKey } = JSON.parse(record.body);

		const jsonKey = `json/${baseKey}.json`;
		const imageKey = `images/${baseKey}.jpg`;

		const getObjectCommand = new GetObjectCommand({
			Bucket: bucket,
			Key: jsonKey,
		});
		const jsonS3Object = await s3Client.send(getObjectCommand);

		if (jsonS3Object.Body) {
			const streamToString = (stream: any) =>
				new Promise<string>((resolve, reject) => {
					const chunks: Uint8Array[] = [];
					stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
					stream.once('end', () =>
						resolve(Buffer.concat(chunks).toString('utf-8'))
					);
					stream.once('error', reject);
				});

			const jsonContent = await streamToString(jsonS3Object.Body);
			const payload = JSON.parse(jsonContent);

			const putItemCommand = new PutItemCommand({
				TableName: dynamoTableName,
				Item: {
					...payload,
					imageS3Key: { S: imageKey },
				},
			});

			await dynamoDBClient.send(putItemCommand);
		}
	}
};
