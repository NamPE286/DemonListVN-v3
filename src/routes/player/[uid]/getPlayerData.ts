import { isSupporterActive } from '$lib/client/isSupporterActive';

export async function getPlayerData(player: any, fetch: any) {
	const uid: string = player.uid;
	const records: any = await (
		await fetch(
			`${import.meta.env.VITE_API_URL}/player/${player.uid}/records?sortBy=pt&end=500&isChecked=true&ascending=false`
		)
	).json();

	return {
		player: player,
		records: records
	};
}
