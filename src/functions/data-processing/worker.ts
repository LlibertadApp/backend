import { SQSEvent } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { streamToString } from '@/_core/utils/stream-to-string';

const s3Client = new S3Client({});

export const handler = async (event: SQSEvent): Promise<void> => {
	for (const record of event.Records) {
		const { bucket, baseKey } = JSON.parse(record.body);

		console.log('EVEEEENT', record.body)
		// const jsonKey = `${SQS_OCRS_JSON_FOLDER_PATH}/${baseKey}.json`;
		//
		// const getObjectCommand = new GetObjectCommand({
		// 	Bucket: bucket,
		// 	Key: jsonKey,
		// });
		// const jsonS3Object = await s3Client.send(getObjectCommand);
		//
		// if (jsonS3Object.Body) {
		// 	const jsonContent = await streamToString(jsonS3Object.Body);
		// 	const payload = JSON.parse(jsonContent);
		//
		// 	const putItemCommand = new PutItemCommand({
		// 		TableName: dynamoTableName,
		// 		Item: {
		// 			...payload,
		// 			imageS3Key: { S: imageKey },
		// 		},
		// 	});
		//
		// 	await dynamoDBClient.send(putItemCommand);
		// }
	}
};
