import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const seasonRes = await fetch(`${import.meta.env.VITE_API_URL}/battlepass`);

		if (!seasonRes.ok) {
			return {
				season: null,
				levels: [],
				mapPacks: [],
				rewards: [],
				missions: [],
				dailyWeekly: { daily: null, weekly: null }
			};
		}

		const season = await seasonRes.json();

		const [levelsRes, mapPacksRes, rewardsRes, missionsRes, dailyWeeklyRes] = await Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/levels`),
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappacks`),
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/rewards`),
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${season.id}/missions`),
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/daily-weekly`)
		]);

		const levels = levelsRes.ok ? await levelsRes.json() : [];
		const mapPacks = mapPacksRes.ok ? await mapPacksRes.json() : [];
		const rewards = rewardsRes.ok ? await rewardsRes.json() : [];
		const missions = missionsRes.ok ? await missionsRes.json() : [];
		const dailyWeekly = dailyWeeklyRes.ok ? await dailyWeeklyRes.json() : { daily: null, weekly: null };

		return {
			season,
			levels,
			mapPacks,
			rewards,
			missions,
			dailyWeekly
		};
	} catch (e) {
		return {
			season: null,
			levels: [],
			mapPacks: [],
			rewards: [],
			missions: [],
			dailyWeekly: { daily: null, weekly: null }
		};
	}
};
