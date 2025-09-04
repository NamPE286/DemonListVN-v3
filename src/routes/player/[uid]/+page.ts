import { redirect } from '@sveltejs/kit';
import { getPlayerData } from './getPlayerData.js';
import { isActive } from '$lib/client/isSupporterActive.js';

export async function load({ params, url, fetch }) {
	const { uid } = params;
	const player: any = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${uid}`)).json();

	if (isActive(player.supporterUntil)) {
		throw redirect(307, `/@${player.name}`);
	}

	if (uid.startsWith('@') && !isActive(player.supporterUntil)) {
		throw redirect(307, `/supporter`);
	}

	return await getPlayerData(player, fetch);
}
