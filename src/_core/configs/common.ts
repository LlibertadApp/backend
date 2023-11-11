interface Primitives {
	Authorization: string;
	base64: BufferEncoding;
	ascii: BufferEncoding;
	splitDot: string;
	jpg: string;
	json: string;
}

export const primitives: Primitives = {
	Authorization: 'Authorization',
	base64: 'base64',
	ascii: 'ascii',
	splitDot: '.',
	jpg: 'jpg',
	json: 'json',
};

export const SQS_OCRS_JSON_FOLDER_PATH = 'json/';
export const SQS_OCRS_IMAGES_FOLDER_PATH = 'images/';
