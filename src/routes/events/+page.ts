export async function load({ params, url, fetch }) {
	const events: any = await (await fetch(`${import.meta.env.VITE_API_URL}/events`)).json();

	return { events };
}
