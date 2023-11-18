import { S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

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
	console.log('S3EVENT', event);
	for (const record of event.Records) {
		const bucketName = record.s3.bucket.name
		const objectKey = record.s3.object.key

		const getObjectCommand = new GetObjectCommand({ bucketName, objectKey })

		const response = await client.send(getObjectCommand)

		if (response.Body) {
			const objectData = response.Body.toString('utf-8');
			const obj = JSON.parse(objectData)
			console.log('DATOSSS', obj)
		}
	}
};
