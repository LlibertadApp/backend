import { infraestructureErrors } from '@/_core/configs/errorConstants';
import { SQSEvent } from 'aws-lambda';
import { S3, DynamoDB } from 'aws-sdk';

const s3 = new S3();
const dynamoDB = new DynamoDB.DocumentClient();

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

		const jsonS3Object = await s3
			.getObject({ Bucket: bucket, Key: jsonKey })
			.promise();

		if (jsonS3Object.Body) {
			const jsonContent = jsonS3Object.Body.toString('utf-8');
			const payload = JSON.parse(jsonContent);

			await dynamoDB
				.put({
					TableName: dynamoTableName,
					Item: {
						...payload,
						imageS3Key: imageKey,
					},
				})
				.promise();
		}
	}
};
