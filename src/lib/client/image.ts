export async function convertToWebpFile(file: File, name: string | null = null): Promise<File> {
	const img = new Image();
	img.src = URL.createObjectURL(file);
	await img.decode();

	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;

	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0);

	const blob: Blob = await new Promise((resolve) =>
		canvas.toBlob((b) => resolve(b!), 'image/webp', 1)
	);

	const webpFile = new File(
		[blob],
		name ? `${name}.webp` : file.name.replace(/\.[^.]+$/, '.webp'),
		{ type: 'image/webp' }
	);

	return webpFile;
}
