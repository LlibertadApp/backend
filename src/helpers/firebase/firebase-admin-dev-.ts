import admin from 'firebase-admin';

interface FirebaseAdminAppParams {
	projectId: string;
	clientEmail: string;
	storageBucket: string;
	privateKey: string;
}

function formatFirebasePrivateKey(key: string) {
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
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
		privateKey: process.env.FIREBASE_PRIVATE_KEY!,
	};

	console.log('Firebase Admin Params:', params);

	return createFirebaseAdminApp(params);
}
