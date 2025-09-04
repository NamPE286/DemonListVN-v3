import { isActive } from '$lib/client/isSupporterActive.js';
import { redirect } from '@sveltejs/kit';
import { getPlayerData } from '../player/[uid]/getPlayerData.js';

export async function load({ params, url, fetch }) {
	const { username } = params;
	const player: any = await (
		await fetch(`${import.meta.env.VITE_API_URL}/player/@${username}`)
	).json();

	if (!isActive(player.supporterUntil)) {
		throw redirect(307, `/supporter`);
	}

	return await getPlayerData(player, fetch);
}
