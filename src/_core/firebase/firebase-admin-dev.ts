import admin from 'firebase-admin';
import { Buffer } from 'buffer';

interface FirebaseAdminAppParams {
	projectId: string;
	clientEmail: string;
	storageBucket: string;
	privateKey: string;
}

function formatFirebasePrivateKey(base64Key: string) {
	const key = Buffer.from(base64Key, 'base64').toString('ascii');
	return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
	const privateKey = formatFirebasePrivateKey(params.privateKey);

	if (admin.apps.length > 0) {
		return admin.app();
	}

	const cert = admin.credential.cert({
		projectId: params.projectId,
		clientEmail: params.clientEmail,
		privateKey,
	});

	return admin.initializeApp({
		credential: cert,
		projectId: params.projectId,
		storageBucket: params.storageBucket,
	});
}

export async function initializeAdminDev() {
	const params = {
		projectId: process.env.FIREBASE_PROJECT_ID!,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
		privateKey: process.env.FIREBASE_PRIVATE_KEY!,  // This should be base64 encoded
	};

	return createFirebaseAdminApp(params);
}
