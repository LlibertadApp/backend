import { S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const s3Client = new S3Client({});
const sqsClient = new SQSClient({});
const BACKEND_QUEUE_URL = process.env.BACKEND_QUEUE_URL!;
const PUBLIC_QUEUE_URL = process.env.PUBLIC_QUEUE_URL;

const streamToString = (stream: any) =>
	new Promise<string>((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
		stream.once('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
		stream.once('error', reject);
	});

/**
{
	"eventVersion":"2.1",
	"eventSource":"aws:s3",
	"awsRegion":"us-east-2",
	"eventTime":"2023-11-18T22:36:30.059Z",
	"eventName":"ObjectCreated:Put",
	"userIdentity":{
		 "principalId":"AWS:AROA47F4QEVNG5YOPKEGY:post-actas"
	},
	"requestParameters":{
		 "sourceIPAddress":"3.144.186.70"
	},
	"responseElements":{
		 "x-amz-request-id":"8ACTYTCZMRH3839K",
		 "x-amz-id-2":"eOZ1pHRhX5MZHirv/gahhj5WtBPbvX3T0mJCwYZLBhtgYSY/6ZIFVoXVSNMCqz9uPvy60YAkmxvBt7RKpilw5TtqkLaNiGTf10K2gGt1G8o="
	},
	"s3":{
		 "s3SchemaVersion":"1.0",
		 "configurationId":"Upload objects",
		 "bucket":{
				"name":"libertapp-front-upload-dev",
				"ownerIdentity":{
					 "principalId":"A2PGOCIQXSPNA6"
				},
				"arn":"arn:aws:s3:::libertapp-front-upload-dev"
		 },
		 "object":{
				"key":"payloads/01-001-00002-00007-0031_20231118-223629_e4940d26.json",
				"size":324,
				"eTag":"701d6429556bb04da98eb85960f27c04",
				"sequencer":"0065593C6E06FF3733"
		 }
	}
}
*/

export const handler = async (event: S3Event): Promise<void> => {
	console.log('event', event);
	for (const record of event.Records) {
		const bucketName = record.s3.bucket.name
		const objectKey = record.s3.object.key

		const getObjectCommand = new GetObjectCommand({
			Bucket: bucketName,
			Key: objectKey
		})

		const response = await s3Client.send(getObjectCommand)

		if (response.Body) {
			const jsonContent = await streamToString(response.Body);
			const payload = JSON.parse(jsonContent);
			console.log('payload', payload)

			const command = new SendMessageCommand({
		    QueueUrl: BACKEND_QUEUE_URL,
		    MessageBody: JSON.stringify(payload),
		  });

			const res = await client.send(command);
		  console.log(res);

		  return res;
		}
	}
};
