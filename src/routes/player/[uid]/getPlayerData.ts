export async function getPlayerData(player: any, fetch: any) {
	const records: any = await (
		await fetch(
			`${import.meta.env.VITE_API_URL}/player/${player.uid}/records?sortBy=pt&end=500&isChecked=true&ascending=false`
		)
	).json();
	const events: any[] = await (
		await fetch(`${import.meta.env.VITE_API_URL}/player/${player.uid}/events`)
	).json();

	return {
		player: player,
		records: records,
		events: events
	};
}
