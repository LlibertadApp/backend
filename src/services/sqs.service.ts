import { Logger } from "@aws-lambda-powertools/logger";
import {
  ReceiveMessageCommandInput,
  ReceiveMessageCommandOutput,
  SQS,
  SQSClientConfig,
  SendMessageCommandInput,
  SendMessageResult,
} from "@aws-sdk/client-sqs";
import { getAwsCredentials } from "@/helpers/configs/aws.helpers";
import { OperationInterface } from "@/interfaces/operation.interface";

export default class SQSService {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger({ serviceName: `sqs-client` });
  }

  async publishMessage(
    queueUrl: string,
    payload: Record<string, unknown>
  ): Promise<OperationInterface<SendMessageResult>> {
    try {
      const config = this.configureClient(queueUrl);

      const sqs = new SQS(config);

      const params: SendMessageCommandInput = {
        MessageBody: JSON.stringify(payload),
        QueueUrl: queueUrl,
      };

      const response = await sqs.sendMessage(params);
      return { ok: true, result: response };
    } catch (e) {
      this.logger.error(e);

      return { ok: false, error: e };
    }
  }

  async consumeMessage(
    queueUrl: string,
    visibilityTimeout: number = 30,
    waitTimeSeconds: number = 20,
    maxNumberOfMessages: number = 10
  ): Promise<OperationInterface<ReceiveMessageCommandOutput>> {
    try {
      const config = this.configureClient(queueUrl);

      const sqs = new SQS(config);

      const params: ReceiveMessageCommandInput = {
        QueueUrl: queueUrl,
        VisibilityTimeout: visibilityTimeout,
        WaitTimeSeconds: waitTimeSeconds,
        MaxNumberOfMessages: maxNumberOfMessages,
      };

      const response = await sqs.receiveMessage(params);
      return { ok: true, result: response };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: e };
    }
  }

  private configureClient(queueUrl: string): SQSClientConfig {
    const credentials = getAwsCredentials();

    const sqsConfig: SQSClientConfig = {
      endpoint: queueUrl,
      ...(credentials && { credentials }),
      region: process.env.AWS_REGION,
    };

    return sqsConfig;
  }
}
