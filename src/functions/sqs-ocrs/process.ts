import { SQSEvent } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { infraestructureErrors } from '@/_core/configs/errorConstants';
import { streamToString } from '@/_core/utils/stream-to-string';

const s3Client = new S3Client({});
const dynamoDBClient = new DynamoDBClient({});

const jsonFolderPath = 'json/';
const imagesFolderPath = 'images/';

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

		const jsonKey = `${jsonFolderPath}/${baseKey}.json`;
		const imageKey = `${imagesFolderPath}/${baseKey}.jpg`;

		const getObjectCommand = new GetObjectCommand({
			Bucket: bucket,
			Key: jsonKey,
		});
		const jsonS3Object = await s3Client.send(getObjectCommand);

		if (jsonS3Object.Body) {
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
