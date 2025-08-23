export async function upload(path: string, data: any, token: string) {
	const url = await (
		await fetch(`${import.meta.env.VITE_API_URL}/storage/presign?path=${path}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
	).text();

    console.log(data)

	await fetch(url, {
		method: 'PUT',
		body: data
	});
}
