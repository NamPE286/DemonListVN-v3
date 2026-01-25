<script lang="ts">
	import type { PageData } from './$types';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { _ } from 'svelte-i18n';
	import Crown from 'lucide-svelte/icons/crown';
	import Star from 'lucide-svelte/icons/star';
	import Gift from 'lucide-svelte/icons/gift';
	import Lock from 'lucide-svelte/icons/lock';
	import Zap from 'lucide-svelte/icons/zap';
	import Target from 'lucide-svelte/icons/target';
	import Map from 'lucide-svelte/icons/map';
	import Sun from 'lucide-svelte/icons/sun';
	import {
		XP_PER_TIER,
		MAX_TIER,
		PREMIUM_PRICE
	} from '$lib/battlepass/constants';
	import PremiumPurchaseDialog from './PremiumPurchaseDialog.svelte';
	import RewardsTab from './RewardsTab.svelte';
	import DailyTab from './DailyTab.svelte';
	import LevelsTab from './LevelsTab.svelte';
	import MapPacksTab from './MapPacksTab.svelte';
	import MissionsTab from './MissionsTab.svelte';
	import BattlepassTopBanner from './BattlepassTopBanner.svelte';

	export let data: PageData;

	let progress: any = null;
	let loading = true;
	let claimableRewards: any[] = [];
	let missionStatus: Record<number, { completed: boolean; claimed: boolean }> = {};
	let purchaseDialogOpen = false;
	
	// Level progress tracking (battlePassLevelId -> progress percentage)
	let levelProgress: Record<number, number> = {};
	
	// Map pack progress tracking (battlePassMapPackId -> { completedLevels, claimed })
	let mapPackProgress: Record<number, { completedLevels: number[]; claimed: boolean }> = {};
	
	// Map pack level progress tracking (battlePassMapPackId_levelID -> progress percentage)
	let mapPackLevelProgress: Record<string, number> = {};

	// Primary color from season (default to purple if not set)
	$: primaryColor = data.season?.primaryColor || '#8b5cf6';

	// Helper function to convert hex to RGB
	function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: null;
	}

	// Generate CSS variable strings
	$: cssVars = (() => {
		const rgb = hexToRgb(primaryColor);
		if (!rgb) return '';
		return `--primary-color: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
	})();

	// Daily and Weekly levels from API
	let dailyWeeklyData: { daily: any; weekly: any } = data.dailyWeekly || { daily: null, weekly: null };

	// Computed daily level data
	$: dailyLevel = dailyWeeklyData.daily
		? {
				id: dailyWeeklyData.daily.id,
				levelId: dailyWeeklyData.daily.levelID,
				name: dailyWeeklyData.daily.levels?.name || $_('battlepass.placeholder_daily_level'),
				difficulty: dailyWeeklyData.daily.levels?.difficulty || 'harder',
				progress: dailyWeeklyData.daily.progress ?? 0,
				completed: (dailyWeeklyData.daily.progress ?? 0) >= 100,
				claimed: dailyWeeklyData.daily.completionClaimed ?? false,
				minProgressClaimed: dailyWeeklyData.daily.minProgressClaimed ?? false,
				minProgress: dailyWeeklyData.daily.minProgress ?? 50,
				minProgressXp: dailyWeeklyData.daily.minProgressXp ?? 500,
				xp: dailyWeeklyData.daily.xp ?? 1000
			}
		: {
				id: 0,
				levelId: 0,
				name: $_('battlepass.no_daily_level'),
				difficulty: 'harder',
				progress: 0,
				completed: false,
				claimed: false,
				minProgressClaimed: false,
				minProgress: 50,
				minProgressXp: 500,
				xp: 1000
			};

	// Computed weekly level data
	$: weeklyDemon = dailyWeeklyData.weekly
		? {
				id: dailyWeeklyData.weekly.id,
				levelId: dailyWeeklyData.weekly.levelID,
				name: dailyWeeklyData.weekly.levels?.name || $_('battlepass.placeholder_weekly_demon'),
				difficulty: dailyWeeklyData.weekly.levels?.difficulty || 'medium_demon',
				progress: dailyWeeklyData.weekly.progress ?? 0,
				completed: (dailyWeeklyData.weekly.progress ?? 0) >= 100,
				claimed: dailyWeeklyData.weekly.completionClaimed ?? false,
				minProgressClaimed: dailyWeeklyData.weekly.minProgressClaimed ?? false,
				minProgress: dailyWeeklyData.weekly.minProgress ?? 50,
				minProgressXp: dailyWeeklyData.weekly.minProgressXp ?? 500,
				xp: dailyWeeklyData.weekly.xp ?? 1000
			}
		: {
				id: 0,
				levelId: 0,
				name: $_('battlepass.no_weekly_level'),
				difficulty: 'medium_demon',
				progress: 0,
				completed: false,
				claimed: false,
				minProgressClaimed: false,
				minProgress: 50,
				minProgressXp: 500,
				xp: 1000
			};

	$: currentTier = progress ? Math.min(Math.floor(progress.xp / XP_PER_TIER), MAX_TIER) : 0;
	$: tierProgress = progress ? progress.xp % XP_PER_TIER : 0;
	$: isPremium = progress?.isPremium ?? false;
	$: daysRemaining = data.season
		? Math.max(
				0,
				Math.ceil((new Date(data.season.end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
			)
		: 0;

	async function fetchProgress() {
		if (!$user.loggedIn || !data.season) {
			return;
		}

		loading = true;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/progress`, {
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

			if (res.ok) {
				progress = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch progress:', e);
		}

		loading = false;
	}

	async function fetchClaimableRewards() {
		if (!$user.loggedIn) return;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/rewards/claimable`, {
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

			if (res.ok) {
				claimableRewards = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch claimable rewards:', e);
		}
	}

	async function fetchMissionStatus() {
		if (!$user.loggedIn || !data.season) return;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/missions`, {
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

			if (res.ok) {
				const missions = await res.json();
				missions.forEach((m: any) => {
					missionStatus[m.id] = { completed: m.completed, claimed: m.claimed };
				});
			}
		} catch (e) {
			console.error('Failed to fetch mission status:', e);
		}
	}

	async function fetchLevelProgress() {
		if (!$user.loggedIn || !data.season) return;

		try {
			// Fetch level progress in batch
			const levelIds = data.levels.map((l: any) => l.id);
			if (levelIds.length === 0) return;

			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/levels/progress?ids=${levelIds.join(',')}`,
				{
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				const progressData = await res.json();
				progressData.forEach((p: any) => {
					levelProgress[p.battlePassLevelId] = p.progress ?? 0;
				});
				levelProgress = levelProgress; // Trigger reactivity
			}
		} catch (e) {
			console.error('Failed to fetch level progress:', e);
		}
	}

	async function fetchMapPackProgress() {
		if (!$user.loggedIn || !data.season) return;

		try {
			// Fetch all map pack progress in batch
			const mapPackIds = data.mapPacks.map((mp: any) => mp.id);
			if (mapPackIds.length === 0) return;

			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/mappacks/progress?ids=${mapPackIds.join(',')}`,
				{
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				const progressData = await res.json();
				progressData.forEach((p: any) => {
					mapPackProgress[p.battlePassMapPackId] = {
						completedLevels: p.completedLevels ?? [],
						claimed: p.claimed ?? false
					};
				});
				mapPackProgress = mapPackProgress; // Trigger reactivity
			}

			// Fetch map pack level progress in batch
			const levelRequests: { mapPackId: number; levelID: number }[] = [];
			data.mapPacks.forEach((mp: any) => {
				mp.mapPacks?.mapPackLevels?.forEach((level: any) => {
					levelRequests.push({ mapPackId: mp.id, levelID: level.levelID });
				});
			});

			if (levelRequests.length > 0) {
				const levelRes = await fetch(
					`${import.meta.env.VITE_API_URL}/battlepass/mappacks/levels/progress`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${await $user.token()}`
						},
						body: JSON.stringify({ levels: levelRequests })
					}
				);

				if (levelRes.ok) {
					const levelProgressData = await levelRes.json();
					levelProgressData.forEach((p: any) => {
						const key = `${p.battlePassMapPackId}_${p.levelID}`;
						mapPackLevelProgress[key] = p.progress ?? 0;
					});
					mapPackLevelProgress = mapPackLevelProgress; // Trigger reactivity
				}
			}
		} catch (e) {
			console.error('Failed to fetch map pack progress:', e);
		}
	}

	async function claimReward(rewardId: number) {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/reward/${rewardId}/claim`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				toast.success('Reward claimed!');
				await fetchClaimableRewards();
				await fetchProgress();
			} else {
				const error = await res.text();
				toast.error(error || 'Failed to claim reward');
			}
		} catch (e) {
			toast.error('Failed to claim reward');
		}
	}

	async function claimMission(missionId: number) {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/mission/${missionId}/claim`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				toast.success('Mission reward claimed!');
				missionStatus[missionId] = { ...missionStatus[missionId], claimed: true };
				await fetchProgress();
			} else {
				const error = await res.text();
				toast.error(error || 'Failed to claim mission');
			}
		} catch (e) {
			toast.error('Failed to claim mission');
		}
	}

	async function claimMapPack(mapPackId: number) {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/mappack/${mapPackId}/claim`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				const result = await res.json();
				toast.success(`Claimed ${result.xp} XP!`);
				await fetchProgress();
				await fetchMapPackProgress();
			} else {
				const error = await res.text();
				toast.error(error || 'Failed to claim map pack');
			}
		} catch (e) {
			toast.error('Failed to claim map pack');
		}
	}

	async function fetchDailyWeeklyProgress() {
		if (!$user.loggedIn || !data.season) return;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/daily-weekly`, {
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

			if (res.ok) {
				dailyWeeklyData = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch daily/weekly progress:', e);
		}
	}

	async function claimDailyWeeklyReward(levelId: number, claimType: 'minProgress' | 'completion') {
		if (!$user.loggedIn) return;

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/level/${levelId}/claim/${claimType}`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				const result = await res.json();
				toast.success($_('battlepass.xp_claimed', { values: { xp: result.xp } }));
				await fetchProgress();
				await fetchDailyWeeklyProgress();
			} else {
				const errorData = await res.json();
				toast.error(errorData.message || $_('battlepass.claim_failed'));
			}
		} catch (e) {
			toast.error($_('battlepass.claim_failed'));
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount);
	}

	onMount(async () => {
		if ($user.loggedIn) {
			await Promise.all([
				fetchProgress(),
				fetchClaimableRewards(),
				fetchMissionStatus(),
				fetchLevelProgress(),
				fetchMapPackProgress(),
				fetchDailyWeeklyProgress()
			]);
		}
	});

	$: if ($user.loggedIn) {
		fetchProgress();
		fetchClaimableRewards();
		fetchMissionStatus();
		fetchLevelProgress();
		fetchMapPackProgress();
		fetchDailyWeeklyProgress();
	}
</script>

<svelte:head>
	<title>{$_('battlepass.title')} - Demon List VN</title>
</svelte:head>

{#if !data.season}
	<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
		<div class="text-6xl">🎮</div>
		<h2 class="text-2xl font-bold">{$_('battlepass.no_active_season')}</h2>
		<p class="text-muted-foreground">{$_('battlepass.check_back_later')}</p>
	</div>
{:else}
	<BattlepassTopBanner
		cssVars={cssVars}
		season={data.season}
		{primaryColor}
		{daysRemaining}
		{loading}
		{progress}
		{claimableRewards}
		{currentTier}
		{tierProgress}
		{isPremium}
		bind:purchaseDialogOpen
		formatCurrency={formatCurrency}
	/>

	<!-- Main Content Tabs -->
	<div class="mx-auto max-w-6xl px-4 py-8">
		<Tabs.Root value="rewards" class="flex flex-col items-center">
			<Tabs.List class="mb-6 grid w-full max-w-2xl grid-cols-5">
				<Tabs.Trigger value="rewards" class="flex items-center gap-2">
					<Gift class="h-4 w-4" />
					<span class="hidden sm:inline">{$_('battlepass.tabs.rewards')}</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="daily" class="flex items-center gap-2">
					<Sun class="h-4 w-4" />
					<span class="hidden sm:inline">{$_('battlepass.tabs.daily')}</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="levels" class="flex items-center gap-2">
					<Star class="h-4 w-4" />
					<span class="hidden sm:inline">{$_('battlepass.tabs.levels')}</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="mappacks" class="flex items-center gap-2">
					<Map class="h-4 w-4" />
					<span class="hidden sm:inline">{$_('battlepass.tabs.mappacks')}</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="missions" class="flex items-center gap-2">
					<Target class="h-4 w-4" />
					<span class="hidden sm:inline">{$_('battlepass.tabs.missions')}</span>
				</Tabs.Trigger>
			</Tabs.List>

			<!-- Rewards Tab -->
			<Tabs.Content value="rewards" class="w-full">
				<RewardsTab
					rewards={data.rewards}
					{currentTier}
					{isPremium}
					{claimableRewards}
					onClaimReward={claimReward}
				/>
			</Tabs.Content>

			<!-- Daily/Weekly Tab -->
			<Tabs.Content value="daily" class="w-full">
				<DailyTab
					{primaryColor}
					isLoggedIn={$user.loggedIn}
					{dailyLevel}
					{weeklyDemon}
					on:claim={(e) => claimDailyWeeklyReward(e.detail.levelId, e.detail.claimType)}
				/>
			</Tabs.Content>

			<!-- Levels Tab -->
			<Tabs.Content value="levels" class="w-full">
				<LevelsTab
					levels={data.levels}
					{levelProgress}
					{primaryColor}
				/>
			</Tabs.Content>

			<!-- Map Packs Tab -->
			<Tabs.Content value="mappacks" class="w-full">
				<MapPacksTab
					mapPacks={data.mapPacks}
					{mapPackProgress}
					{mapPackLevelProgress}
					{primaryColor}
					isLoggedIn={$user.loggedIn}
					onClaimMapPack={claimMapPack}
				/>
			</Tabs.Content>

			<!-- Missions Tab -->
			<Tabs.Content value="missions" class="w-full">
				<MissionsTab
					missions={data.missions}
					{missionStatus}
					{primaryColor}
					isLoggedIn={$user.loggedIn}
					onClaimMission={claimMission}
				/>
			</Tabs.Content>
		</Tabs.Root>
	</div>

	<!-- Premium Purchase Dialog -->
	<PremiumPurchaseDialog bind:open={purchaseDialogOpen} seasonTitle={data.season?.title || ''} />
{/if}

<style lang="scss">
	/* Hero styles moved to BattlepassTopBanner component */
</style>
