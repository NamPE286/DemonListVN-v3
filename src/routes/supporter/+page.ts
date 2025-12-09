export async function load({ fetch }) {
	try {
		const intervalMs = 30 * 24 * 60 * 60 * 1000; // 30 days
		const topBuyers: any = await (await fetch(`${import.meta.env.VITE_API_URL}/buyers/top?interval=${intervalMs}`)).json();
		
		return { topBuyers };
	} catch (error) {
		console.error('Failed to fetch top buyers:', error);
		return { topBuyers: [] };
	}
}
