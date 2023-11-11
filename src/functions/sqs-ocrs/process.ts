import { SQSEvent } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
	InfraestructureErrorsEnum,
	infraestructureErrors,
} from '@/_core/configs/errorConstants';
import { streamToString } from '@/_core/utils/stream-to-string';
import {
	SQS_OCRS_IMAGES_FOLDER_PATH,
	SQS_OCRS_JSON_FOLDER_PATH,
	primitives,
} from '@/_core/configs/common';

const s3Client = new S3Client({});
const dynamoDBClient = new DynamoDBClient({});

export const handler = async (event: SQSEvent): Promise<void> => {
	const dynamoTableName = process.env.AWS_TABLA_DYNAMO_SQS_OCRS;

	if (!dynamoTableName) {
		throw new Error(
			infraestructureErrors.ENVIRONMENT_VARIABLE_NOT_FOUND(
				InfraestructureErrorsEnum.AWS_TABLA_DYNAMO_SQS_OCRS
			)
		);
	}

	for (const record of event.Records) {
		const { bucket, baseKey } = JSON.parse(record.body);

		const imageKey = `${SQS_OCRS_IMAGES_FOLDER_PATH}/${baseKey}.${primitives.jpg}`;
		const jsonKey = `${SQS_OCRS_JSON_FOLDER_PATH}/${baseKey}.${primitives.json}`;

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
