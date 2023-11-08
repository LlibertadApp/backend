import * as AWS from "@aws-sdk/client-secrets-manager";
import * as admin from 'firebase-admin';

const secretsManager = new AWS.SecretsManager({ region: process.env.AWS_REGION });

async function getFirebaseServiceAccount() {
  const secretName = process.env.FIREBASE_SERVICE_ACCOUNT_SECRET_NAME;
  if (secretName) {
    const data = await secretsManager.getSecretValue({ SecretId: secretName});

    if ('SecretString' in data && typeof data.SecretString === 'string') {
      return JSON.parse(data.SecretString);
    } else {
      throw new Error('Secret not found or is not a string');
    }
  }
  else {
    throw new Error('Env variable not found: FIREBASE_SERVICE_ACCOUNT_SECRET_NAME');
  }
}

export async function initializeApp() {
  if (admin.apps.length === 0) {
    const serviceAccount = await getFirebaseServiceAccount();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}