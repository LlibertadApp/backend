import { SQSEvent } from 'aws-lambda';
import { createScutiny } from "@/helpers/daos/scrutinyDao";

/**
{
  Records: [
    {
      messageId: '7cbf9c59-333c-423e-88e7-736dd5280ec0',
      receiptHandle: 'AQEBPZalfMJAxm5AVHtyrISglCYnIyYoA/5KL6ICIW4TLDHBcpBfr6kq+pWdWgLK/5BGhuwJB4G3qe0HqXZfCoXGYNJxVD8KXIPfLRRS0CoCF3JwQ9e1y4UtppQG/qDV6h5g/EoQQLA0PVmTdAnAub7vibjMDsAFXGC9jqwH+M2nZQSuiTtao7NIcF+TFC6BNtnUBEonGCXH7g1vjq2SFKLBP0T6p5VHorS+T7kUTeWSx/xkdkfR/HvU8a8Ey3riK0/OQZHdqksoXMnuZ24M+RnZvXvl+pmIINnNz398coS+YnCvF5WYqPKA6wXyGMP0rdeeTqN1trKOcBZqE2Q0eQnfBqN3utA/a1s75d211FLG6pmR2Hhn7qO1fJNOMJ455HhWud2lf490s9OFg9ni9FrTMGSeA41caddQR7RGoSctoCg=',
      body: '{"mesaId":"01-001-00002-00007-0031","conteoLla":"0","conteoUp":"4861","votosImpugnados":"9","votosNulos":"2","votosEnBlanco":"56","votosRecurridos":"2","votosEnTotal":"596","userId":"d734d79f-3c0f-4f59-ae6e-7b95caef2e7b","imagenActa":{"path":"actas/01-001-00002-00007-0031_20231119-13615_e5389fa9.jpg"},"estado":"ANOMALIA"}',
      attributes: [Object],
      messageAttributes: {},
      md5OfBody: '460f5d500fc1070216b6229665af2b04',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-2:891601036634:lla-api-dev-backend-main',
      awsRegion: 'us-east-2'
    }
  ]
}
*/

export const handler = async (event: SQSEvent): Promise<void> => {
	console.log('event', event);
	for (const record of event.Records) {
		const data = JSON.parse(record.body)
		try {
			const scrutiny = await createScutiny(data)
			console.log(scrutiny)
		} catch (err) {
			console.error(err)
		}
	}
};
