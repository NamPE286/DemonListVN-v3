import { isSupporterActive } from '$lib/client/isSupporterActive.js';
import { redirect } from '@sveltejs/kit';
import { getPlayerData } from '../player/[uid]/getPlayerData.js';

export async function load({ params, url, fetch }) {
	const { username } = params;
	const player: any = await (
		await fetch(`${import.meta.env.VITE_API_URL}/player/@${username}`)
	).json();

	if (!isSupporterActive(player.supporterUntil)) {
		throw new Error('Not accessible')
	}

	return await getPlayerData(player, fetch);
}
