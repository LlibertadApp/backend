export const streamToString = (stream: any) =>
	new Promise<string>((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
		stream.once('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
		stream.once('error', reject);
	});
