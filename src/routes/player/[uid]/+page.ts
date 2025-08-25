import { redirect } from '@sveltejs/kit';
import { getPlayerData } from './getPlayerData.js';
import { isSupporterActive } from '$lib/client/isSupporterActive.js';

export async function load({ params, url, fetch }) {
	const { uid } = params;
	const player: any = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${uid}`)).json();

	if (isSupporterActive(player.supporterUntil)) {
		throw redirect(307, `/@${player.name}`);
	}

	if (uid.startsWith('@') && !isSupporterActive(player.supporterUntil)) {
		throw redirect(307, `/supporter`);
	}

	return await getPlayerData(player, fetch);
}
