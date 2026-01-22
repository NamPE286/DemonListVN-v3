<script lang="ts">
	import type { PageData } from './$types';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { _ } from 'svelte-i18n';
	import Crown from 'lucide-svelte/icons/crown';
	import Star from 'lucide-svelte/icons/star';
	import Gift from 'lucide-svelte/icons/gift';
	import Lock from 'lucide-svelte/icons/lock';
	import Check from 'lucide-svelte/icons/check';
	import Zap from 'lucide-svelte/icons/zap';
	import Target from 'lucide-svelte/icons/target';
	import Map from 'lucide-svelte/icons/map';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Sun from 'lucide-svelte/icons/sun';
	import {
		XP_PER_TIER,
		MAX_TIER,
		DEFAULT_PREMIUM_PRICE,
		DIFFICULTY_COLORS,
		DIFFICULTY_NAMES
	} from '$lib/battlepass/constants';
	import TierRewardTrack from '$lib/components/TierRewardTrack.svelte';

	export let data: PageData;

	// Map Pack Dialog state
	let selectedMapPack: any = null;
	let mapPackDialogOpen = false;

	let progress: any = null;
	let loading = true;
	let claimableRewards: any[] = [];
	let missionStatus: Record<number, { completed: boolean; claimed: boolean }> = {};

	// Hardcoded Daily and Weekly levels (API not available)
	// Names will be replaced by actual level names from API
	$: dailyLevel = {
		id: 12345678,
		name: $_('battlepass.placeholder_daily_level'),
		difficulty: 'harder',
		progress: 0,
		completed: false,
		claimed: false,
		xp: 25
	};

	$: weeklyDemon = {
		id: 87654321,
		name: $_('battlepass.placeholder_weekly_demon'),
		difficulty: 'medium_demon',
		progress: 0,
		completed: false,
		claimed: false,
		xp: 100
	};

	function openMapPackDialog(pack: any) {
		selectedMapPack = pack;
		mapPackDialogOpen = true;
	}

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
		if (!$user.loggedIn || !data.season) return;

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
			} else {
				const error = await res.text();
				toast.error(error || 'Failed to claim map pack');
			}
		} catch (e) {
			toast.error('Failed to claim map pack');
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount);
	}

	function getDifficultyColor(difficulty: string): string {
		return DIFFICULTY_COLORS[difficulty?.toLowerCase()] || '#6b7280';
	}

	function getDifficultyName(difficulty: string): string {
		return DIFFICULTY_NAMES[difficulty?.toLowerCase()] || difficulty || 'Unknown';
	}

	onMount(async () => {
		loading = true;
		if ($user.loggedIn) {
			await Promise.all([fetchProgress(), fetchClaimableRewards(), fetchMissionStatus()]);
		}
		loading = false;
	});

	$: if ($user.checked && $user.loggedIn && !progress) {
		fetchProgress();
		fetchClaimableRewards();
		fetchMissionStatus();
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
	<!-- Hero Section with Background Image -->
	<div class="hero-section relative overflow-hidden">
		<div class="hero-bg-image absolute inset-0">
			<img
				src={data.season.backgroundUrl ||
					'https://via.placeholder.com/1920x600/1a1a2e/eab308?text=Battle+Pass+Season'}
				alt="Season Background"
				class="h-full w-full object-cover opacity-30"
			/>
		</div>
		<div class="hero-bg-overlay absolute inset-0" />
		<div class="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12">
			<div class="flex items-center gap-3">
				<Crown class="h-10 w-10 text-yellow-400" />
				<h1 class="text-4xl font-bold md:text-5xl">{data.season.title}</h1>
			</div>
			<p class="max-w-2xl text-center text-lg text-muted-foreground">{data.season.description}</p>

			<!-- Season Timer -->
			<div class="flex items-center gap-2 rounded-full bg-muted/50 px-6 py-2 backdrop-blur-sm">
				<Zap class="h-5 w-5 text-yellow-400" />
				<span class="font-medium"
					>{$_('battlepass.days_remaining', { values: { count: daysRemaining } })}</span
				>
			</div>

			<!-- User Progress Card -->
			{#if $user.loggedIn}
				<Card.Root
					class="w-full max-w-2xl overflow-hidden border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm"
				>
					<Card.Content class="p-6">
						{#if loading}
							<div class="flex flex-col gap-4">
								<Skeleton class="h-8 w-48" />
								<Skeleton class="h-4 w-full" />
								<Skeleton class="h-6 w-32" />
							</div>
						{:else}
							<div class="flex flex-col gap-4">
								<!-- Tier Display -->
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div
											class="tier-badge flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl font-bold text-black shadow-lg"
										>
											{currentTier}
										</div>
										<div>
											<h3 class="text-xl font-bold">{$_('battlepass.tier')} {currentTier}</h3>
											<p class="text-sm text-muted-foreground">
												{progress?.xp ?? 0} XP {$_('battlepass.total')}
											</p>
										</div>
									</div>
									{#if isPremium}
										<div
											class="flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-black"
										>
											<Crown class="h-5 w-5" />
											<span class="font-bold">PREMIUM</span>
										</div>
									{:else}
										<Button
											class="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600"
										>
											<Crown class="mr-2 h-4 w-4" />
											{$_('battlepass.upgrade')} - {formatCurrency(
												data.season.premiumPrice || DEFAULT_PREMIUM_PRICE
											)}
										</Button>
									{/if}
								</div>

								<!-- XP Progress Bar -->
								<div class="flex flex-col gap-2">
									<div class="flex justify-between text-sm">
										<span
											>{$_('battlepass.progress_to_tier', {
												values: { tier: Math.min(currentTier + 1, MAX_TIER) }
											})}</span
										>
										<span>{tierProgress} / {XP_PER_TIER} XP</span>
									</div>
									<div class="xp-bar-container h-4 overflow-hidden rounded-full bg-muted">
										<div
											class="xp-bar h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
											style="width: {(tierProgress / XP_PER_TIER) * 100}%"
										/>
									</div>
								</div>

								<!-- Claimable Rewards -->
								{#if claimableRewards.length > 0}
									<div
										class="flex items-center gap-2 rounded-lg bg-green-500/20 p-3 text-green-400"
									>
										<Gift class="h-5 w-5" />
										<span class="font-medium"
											>{$_('battlepass.rewards_ready', {
												values: { count: claimableRewards.length }
											})}</span
										>
									</div>
								{/if}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{:else}
				<Card.Root class="w-full max-w-2xl border-2 border-muted backdrop-blur-sm">
					<Card.Content class="flex flex-col items-center gap-4 p-8">
						<Lock class="h-12 w-12 text-muted-foreground" />
						<h3 class="text-xl font-medium">{$_('battlepass.sign_in_to_track')}</h3>
						<p class="text-center text-muted-foreground">
							{$_('battlepass.sign_in_description')}
						</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	</div>

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
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">{$_('battlepass.tier_rewards')}</h2>
					<p class="text-muted-foreground">{$_('battlepass.tier_rewards_desc')}</p>
				</div>

				<TierRewardTrack
					rewards={data.rewards}
					{currentTier}
					{isPremium}
					{claimableRewards}
					editable={false}
					onClaimReward={claimReward}
				/>
			</Tabs.Content>

			<!-- Daily/Weekly Tab -->
			<Tabs.Content value="daily" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">{$_('battlepass.daily_weekly')}</h2>
					<p class="text-muted-foreground">{$_('battlepass.daily_weekly_desc')}</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<!-- Daily Level Card -->
					<Card.Root
						class="overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
					>
						<Card.Header>
							<div class="flex items-center gap-3">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500"
								>
									<Sun class="h-7 w-7 text-white" />
								</div>
								<div>
									<Card.Title class="text-xl">{$_('battlepass.daily_level')}</Card.Title>
									<p class="text-sm text-muted-foreground">{$_('battlepass.resets_daily')}</p>
								</div>
							</div>
						</Card.Header>
						<Card.Content>
							<div class="flex flex-col gap-4">
								<div class="rounded-lg bg-muted/30 p-4">
									<div class="mb-2 flex items-center justify-between">
										<span class="font-medium">{dailyLevel.name}</span>
										<span class="text-sm text-muted-foreground">ID: {dailyLevel.id}</span>
									</div>
									<div
										class="flex items-center gap-2 text-sm"
										style="color: {getDifficultyColor(dailyLevel.difficulty)};"
									>
										<div
											class="h-3 w-3 rounded-full"
											style="background-color: {getDifficultyColor(dailyLevel.difficulty)};"
										></div>
										<span>{getDifficultyName(dailyLevel.difficulty)}</span>
									</div>
								</div>

								<div class="flex flex-col gap-2">
									<div class="flex justify-between text-sm">
										<span class="text-muted-foreground">{$_('battlepass.progress')}</span>
										<span>{dailyLevel.progress}%</span>
									</div>
									<div class="h-3 overflow-hidden rounded-full bg-muted">
										<div
											class="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all"
											style="width: {dailyLevel.progress}%"
										/>
									</div>
								</div>

								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<Zap class="h-5 w-5 text-yellow-400" />
										<span class="font-bold text-yellow-400">+{dailyLevel.xp} XP</span>
									</div>
									{#if $user.loggedIn}
										{#if dailyLevel.claimed}
											<Button variant="outline" disabled class="w-28">
												<Check class="mr-1 h-4 w-4" />
												{$_('battlepass.claimed')}
											</Button>
										{:else if dailyLevel.completed}
											<Button class="w-28 bg-green-500 hover:bg-green-600">
												{$_('battlepass.claim')}
											</Button>
										{:else}
											<Button variant="outline" disabled class="w-28">
												<Lock class="mr-1 h-4 w-4" />
												{$_('battlepass.locked')}
											</Button>
										{/if}
									{/if}
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Weekly Demon Card -->
					<Card.Root
						class="overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
					>
						<Card.Header>
							<div class="flex items-center gap-3">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
								>
									<Calendar class="h-7 w-7 text-white" />
								</div>
								<div>
									<Card.Title class="text-xl">{$_('battlepass.weekly_demon')}</Card.Title>
									<p class="text-sm text-muted-foreground">{$_('battlepass.resets_weekly')}</p>
								</div>
							</div>
						</Card.Header>
						<Card.Content>
							<div class="flex flex-col gap-4">
								<div class="rounded-lg bg-muted/30 p-4">
									<div class="mb-2 flex items-center justify-between">
										<span class="font-medium">{weeklyDemon.name}</span>
										<span class="text-sm text-muted-foreground">ID: {weeklyDemon.id}</span>
									</div>
									<div
										class="flex items-center gap-2 text-sm"
										style="color: {getDifficultyColor(weeklyDemon.difficulty)};"
									>
										<div
											class="h-3 w-3 rounded-full"
											style="background-color: {getDifficultyColor(weeklyDemon.difficulty)};"
										></div>
										<span>{getDifficultyName(weeklyDemon.difficulty)}</span>
									</div>
								</div>

								<div class="flex flex-col gap-2">
									<div class="flex justify-between text-sm">
										<span class="text-muted-foreground">{$_('battlepass.progress')}</span>
										<span>{weeklyDemon.progress}%</span>
									</div>
									<div class="h-3 overflow-hidden rounded-full bg-muted">
										<div
											class="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all"
											style="width: {weeklyDemon.progress}%"
										/>
									</div>
								</div>

								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<Zap class="h-5 w-5 text-yellow-400" />
										<span class="font-bold text-yellow-400">+{weeklyDemon.xp} XP</span>
									</div>
									{#if $user.loggedIn}
										{#if weeklyDemon.claimed}
											<Button variant="outline" disabled class="w-28">
												<Check class="mr-1 h-4 w-4" />
												{$_('battlepass.claimed')}
											</Button>
										{:else if weeklyDemon.completed}
											<Button class="w-28 bg-green-500 hover:bg-green-600">
												{$_('battlepass.claim')}
											</Button>
										{:else}
											<Button variant="outline" disabled class="w-28">
												<Lock class="mr-1 h-4 w-4" />
												{$_('battlepass.locked')}
											</Button>
										{/if}
									{/if}
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>

			<!-- Levels Tab -->
			<Tabs.Content value="levels" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">{$_('battlepass.featured_levels')}</h2>
					<p class="text-muted-foreground">{$_('battlepass.featured_levels_desc')}</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.levels as level}
						<Card.Root
							class="overflow-hidden border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5 transition-all hover:border-red-500/50"
						>
							<Card.Header class="pb-2">
								<div class="flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
										<Star class="h-6 w-6 text-red-400" />
									</div>
									<div>
										<Card.Title class="text-lg"
											>{level.levels?.name || `Level ${level.levelID}`}</Card.Title
										>
										<p class="text-sm text-muted-foreground">ID: {level.levelID}</p>
									</div>
								</div>
							</Card.Header>
							<Card.Content>
								<div class="flex flex-col gap-3">
									<div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
										<span class="text-sm text-muted-foreground">Completion XP</span>
										<span class="font-bold text-yellow-400">+{level.xp} XP</span>
									</div>
									{#if level.minProgress && level.minProgressXp}
										<div class="flex items-center justify-between rounded-lg bg-muted/30 p-3">
											<span class="text-sm text-muted-foreground"
												>{$_('battlepass.progress')} ({level.minProgress}%)</span
											>
											<span class="font-medium text-blue-400">+{level.minProgressXp} XP</span>
										</div>
									{/if}
								</div>
							</Card.Content>
						</Card.Root>
					{:else}
						<div class="col-span-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
							<Star class="h-12 w-12" />
							<p>{$_('battlepass.no_featured_levels')}</p>
						</div>
					{/each}
				</div>
			</Tabs.Content>

			<!-- Map Packs Tab -->
			<Tabs.Content value="mappacks" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">{$_('battlepass.map_packs')}</h2>
					<p class="text-muted-foreground">{$_('battlepass.map_packs_desc')}</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.mapPacks as pack}
						{@const mapPack = pack.mapPacks}
						<button class="text-left" on:click={() => openMapPackDialog(pack)}>
							<Card.Root
								class="h-full cursor-pointer overflow-hidden border-2 transition-all hover:border-primary/50"
								style="border-color: {getDifficultyColor(mapPack?.difficulty)}40;"
							>
								<Card.Header class="pb-2">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-3">
											<div
												class="flex h-12 w-12 items-center justify-center rounded-lg"
												style="background-color: {getDifficultyColor(mapPack?.difficulty)}20;"
											>
												<Map
													class="h-6 w-6"
													style="color: {getDifficultyColor(mapPack?.difficulty)};"
												/>
											</div>
											<div>
												<Card.Title class="text-lg">{mapPack?.name || 'Map Pack'}</Card.Title>
												<p
													class="text-sm"
													style="color: {getDifficultyColor(mapPack?.difficulty)};"
												>
													{getDifficultyName(mapPack?.difficulty)}
												</p>
											</div>
										</div>
										<div
											class="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400"
										>
											+{mapPack?.xp || 0} XP
										</div>
									</div>
								</Card.Header>
								<Card.Content>
									{#if mapPack?.description}
										<p class="mb-3 text-sm text-muted-foreground">{mapPack.description}</p>
									{/if}
									<div class="flex items-center justify-between">
										<span class="text-sm text-muted-foreground">
											{mapPack?.mapPackLevels?.length || 0}
											{$_('battlepass.levels_in_pack')}
										</span>
										{#if pack.unlockWeek > 1}
											<div class="flex items-center gap-2 text-sm text-muted-foreground">
												<Lock class="h-4 w-4" />
												<span
													>{$_('battlepass.unlocks_week', {
														values: { week: pack.unlockWeek }
													})}</span
												>
											</div>
										{/if}
									</div>
								</Card.Content>
							</Card.Root>
						</button>
					{:else}
						<div class="col-span-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
							<Map class="h-12 w-12" />
							<p>{$_('battlepass.no_map_packs')}</p>
						</div>
					{/each}
				</div>
			</Tabs.Content>

			<!-- Missions Tab -->
			<Tabs.Content value="missions" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">{$_('battlepass.missions')}</h2>
					<p class="text-muted-foreground">{$_('battlepass.missions_desc')}</p>
				</div>

				<div class="flex flex-col gap-4">
					{#each data.missions as mission}
						{@const status = missionStatus[mission.id]}
						{@const isCompleted = status?.completed ?? mission.completed}
						{@const isClaimed = status?.claimed ?? mission.claimed}

						<Card.Root
							class="overflow-hidden border-2 transition-all {isCompleted && !isClaimed
								? 'border-green-500/50 bg-green-500/5'
								: isClaimed
									? 'border-muted opacity-60'
									: 'border-muted'}"
						>
							<Card.Content class="flex items-center gap-4 p-4">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-xl {isCompleted
										? 'bg-green-500/20'
										: 'bg-muted'}"
								>
									{#if isClaimed}
										<Check class="h-7 w-7 text-green-400" />
									{:else if isCompleted}
										<Sparkles class="h-7 w-7 text-green-400" />
									{:else}
										<Target class="h-7 w-7 text-muted-foreground" />
									{/if}
								</div>
								<div class="flex-1">
									<h4 class="font-bold {isClaimed ? 'line-through' : ''}">{mission.title}</h4>
									<p class="text-sm text-muted-foreground">{mission.description}</p>
								</div>
								<div class="flex items-center gap-4">
									<div class="text-right">
										<span class="font-bold text-yellow-400">+{mission.xp} XP</span>
										{#if mission.battlePassMissionRewards?.length}
											<div class="mt-1 flex justify-end gap-1">
												{#each mission.battlePassMissionRewards.slice(0, 3) as reward}
													<div class="h-6 w-6 rounded bg-muted">
														{#if reward.itemId}
															<img
																class="h-full w-full object-contain"
																src={`https://cdn.demonlistvn.com/items/${reward.itemId}.webp`}
																alt="Reward"
															/>
														{/if}
													</div>
												{/each}
											</div>
										{/if}
									</div>
									{#if $user.loggedIn}
										{#if isClaimed}
											<Button variant="outline" disabled class="w-24">
												<Check class="mr-1 h-4 w-4" />
												{$_('battlepass.claimed')}
											</Button>
										{:else if isCompleted}
											<Button
												class="w-24 bg-green-500 hover:bg-green-600"
												on:click={() => claimMission(mission.id)}
											>
												{$_('battlepass.claim')}
											</Button>
										{:else}
											<Button variant="outline" disabled class="w-24">
												<Lock class="mr-1 h-4 w-4" />
												{$_('battlepass.locked')}
											</Button>
										{/if}
									{/if}
								</div>
							</Card.Content>
						</Card.Root>
					{:else}
						<div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
							<Target class="h-12 w-12" />
							<p>{$_('battlepass.no_missions')}</p>
						</div>
					{/each}
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>

	<!-- Map Pack Detail Dialog -->
	<Dialog.Root bind:open={mapPackDialogOpen}>
		<Dialog.Content class="max-w-lg">
			{#if selectedMapPack}
				{@const mapPack = selectedMapPack.mapPacks}
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg"
							style="background-color: {getDifficultyColor(mapPack?.difficulty)}20;"
						>
							<Map class="h-5 w-5" style="color: {getDifficultyColor(mapPack?.difficulty)};" />
						</div>
						<div>
							<span>{mapPack?.name || 'Map Pack'}</span>
							<p
								class="text-sm font-normal"
								style="color: {getDifficultyColor(mapPack?.difficulty)};"
							>
								{getDifficultyName(mapPack?.difficulty)}
							</p>
						</div>
					</Dialog.Title>
				</Dialog.Header>

				<div class="mt-4 flex flex-col gap-4">
					{#if mapPack?.description}
						<p class="text-sm text-muted-foreground">{mapPack.description}</p>
					{/if}

					<div class="flex items-center justify-between rounded-lg bg-yellow-500/10 p-3">
						<span class="text-sm">{$_('battlepass.completion_xp')}</span>
						<span class="font-bold text-yellow-400">+{mapPack?.xp || 0} XP</span>
					</div>

					<div>
						<h4 class="mb-2 font-medium">{$_('battlepass.levels_list')}</h4>
						<div class="flex flex-col gap-2">
							{#each mapPack?.mapPackLevels || [] as level, i}
								<div class="flex items-center justify-between rounded-lg bg-muted/30 p-3">
									<div class="flex items-center gap-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
										>
											{i + 1}
										</div>
										<div>
											<span class="font-medium"
												>{level.levels?.name || `Level ${level.levelID}`}</span
											>
											<p class="text-xs text-muted-foreground">ID: {level.levelID}</p>
										</div>
									</div>
									<div class="h-3 w-3 rounded-full bg-muted-foreground/30" />
								</div>
							{/each}
						</div>
					</div>

					{#if selectedMapPack.unlockWeek > 1}
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<Lock class="h-4 w-4" />
							<span
								>{$_('battlepass.unlocks_week', {
									values: { week: selectedMapPack.unlockWeek }
								})}</span
							>
						</div>
					{/if}
				</div>

				<Dialog.Footer class="mt-4">
					<Button variant="outline" on:click={() => (mapPackDialogOpen = false)}>
						{$_('general.close')}
					</Button>
				</Dialog.Footer>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{/if}

<style lang="scss">
	.hero-section {
		min-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-bg-overlay {
		background: linear-gradient(
			135deg,
			rgba(234, 179, 8, 0.1) 0%,
			rgba(249, 115, 22, 0.1) 50%,
			rgba(220, 38, 38, 0.05) 100%
		);
	}

	.tier-badge {
		animation: tier-glow 2s ease-in-out infinite alternate;
	}

	@keyframes tier-glow {
		from {
			box-shadow: 0 0 15px rgba(234, 179, 8, 0.3);
		}
		to {
			box-shadow: 0 0 25px rgba(234, 179, 8, 0.5);
		}
	}

	.xp-bar-container {
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.xp-bar {
		box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
	}
</style>
