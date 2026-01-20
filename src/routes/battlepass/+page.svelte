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
	import { _ } from 'svelte-i18n';
	import Crown from 'lucide-svelte/icons/crown';
	import Star from 'lucide-svelte/icons/star';
	import Trophy from 'lucide-svelte/icons/trophy';
	import Gift from 'lucide-svelte/icons/gift';
	import Lock from 'lucide-svelte/icons/lock';
	import Check from 'lucide-svelte/icons/check';
	import Zap from 'lucide-svelte/icons/zap';
	import Target from 'lucide-svelte/icons/target';
	import Map from 'lucide-svelte/icons/map';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	export let data: PageData;

	const XP_PER_TIER = 100;
	const MAX_TIER = 100;

	let progress: any = null;
	let loading = true;
	let claimableRewards: any[] = [];
	let missionStatus: Record<number, { completed: boolean; claimed: boolean }> = {};

	$: currentTier = progress ? Math.min(Math.floor(progress.xp / XP_PER_TIER), MAX_TIER) : 0;
	$: tierProgress = progress ? (progress.xp % XP_PER_TIER) : 0;
	$: isPremium = progress?.isPremium ?? false;
	$: daysRemaining = data.season ? Math.max(0, Math.ceil((new Date(data.season.end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

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
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/reward/${rewardId}/claim`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

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
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/mission/${missionId}/claim`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

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
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappack/${mapPackId}/claim`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

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
		switch (difficulty?.toLowerCase()) {
			case 'easier': return '#22c55e';
			case 'harder': return '#f97316';
			case 'medium_demon': return '#ef4444';
			case 'insane_demon': return '#a855f7';
			case 'extreme_demon': return '#dc2626';
			default: return '#6b7280';
		}
	}

	function getDifficultyName(difficulty: string): string {
		switch (difficulty?.toLowerCase()) {
			case 'easier': return 'Easier';
			case 'harder': return 'Harder';
			case 'medium_demon': return 'Medium Demon';
			case 'insane_demon': return 'Insane Demon';
			case 'extreme_demon': return 'Extreme Demon';
			default: return difficulty || 'Unknown';
		}
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
	<title>Battle Pass - Demon List VN</title>
</svelte:head>

{#if !data.season}
	<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
		<div class="text-6xl">🎮</div>
		<h2 class="text-2xl font-bold">No Active Season</h2>
		<p class="text-muted-foreground">Check back later for the next Battle Pass season!</p>
	</div>
{:else}
	<!-- Hero Section -->
	<div class="hero-section relative overflow-hidden">
		<div class="hero-bg absolute inset-0" />
		<div class="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12">
			<div class="flex items-center gap-3">
				<Crown class="h-10 w-10 text-yellow-400" />
				<h1 class="text-4xl font-bold md:text-5xl">{data.season.title}</h1>
			</div>
			<p class="max-w-2xl text-center text-lg text-muted-foreground">{data.season.description}</p>
			
			<!-- Season Timer -->
			<div class="flex items-center gap-2 rounded-full bg-muted/50 px-6 py-2 backdrop-blur-sm">
				<Zap class="h-5 w-5 text-yellow-400" />
				<span class="font-medium">{daysRemaining} days remaining</span>
			</div>

			<!-- User Progress Card -->
			{#if $user.loggedIn}
				<Card.Root class="w-full max-w-2xl overflow-hidden border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
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
										<div class="tier-badge flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl font-bold text-black shadow-lg">
											{currentTier}
										</div>
										<div>
											<h3 class="text-xl font-bold">Tier {currentTier}</h3>
											<p class="text-sm text-muted-foreground">{progress?.xp ?? 0} XP Total</p>
										</div>
									</div>
									{#if isPremium}
										<div class="flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-black">
											<Crown class="h-5 w-5" />
											<span class="font-bold">PREMIUM</span>
										</div>
									{:else}
										<Button class="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600">
											<Crown class="mr-2 h-4 w-4" />
											Upgrade - {formatCurrency(data.season.premiumPrice || 149000)}
										</Button>
									{/if}
								</div>

								<!-- XP Progress Bar -->
								<div class="flex flex-col gap-2">
									<div class="flex justify-between text-sm">
										<span>Progress to Tier {Math.min(currentTier + 1, MAX_TIER)}</span>
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
									<div class="flex items-center gap-2 rounded-lg bg-green-500/20 p-3 text-green-400">
										<Gift class="h-5 w-5" />
										<span class="font-medium">{claimableRewards.length} rewards ready to claim!</span>
									</div>
								{/if}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{:else}
				<Card.Root class="w-full max-w-2xl border-2 border-muted">
					<Card.Content class="flex flex-col items-center gap-4 p-8">
						<Lock class="h-12 w-12 text-muted-foreground" />
						<h3 class="text-xl font-medium">Sign in to track your progress</h3>
						<p class="text-center text-muted-foreground">Log in to see your Battle Pass progress and claim rewards</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	</div>

	<!-- Main Content Tabs -->
	<div class="mx-auto max-w-6xl px-4 py-8">
		<Tabs.Root value="rewards" class="flex flex-col items-center">
			<Tabs.List class="mb-6 grid w-full max-w-xl grid-cols-4">
				<Tabs.Trigger value="rewards" class="flex items-center gap-2">
					<Gift class="h-4 w-4" />
					<span class="hidden sm:inline">Rewards</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="levels" class="flex items-center gap-2">
					<Star class="h-4 w-4" />
					<span class="hidden sm:inline">Levels</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="mappacks" class="flex items-center gap-2">
					<Map class="h-4 w-4" />
					<span class="hidden sm:inline">Map Packs</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="missions" class="flex items-center gap-2">
					<Target class="h-4 w-4" />
					<span class="hidden sm:inline">Missions</span>
				</Tabs.Trigger>
			</Tabs.List>

			<!-- Rewards Tab -->
			<Tabs.Content value="rewards" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">Tier Rewards</h2>
					<p class="text-muted-foreground">Earn XP to unlock rewards at each tier</p>
				</div>
				
				<div class="tier-track-container overflow-x-auto pb-4">
					<div class="tier-track flex gap-4 px-4" style="min-width: max-content;">
						{#each Array(MAX_TIER) as _, i}
							{@const tier = i + 1}
							{@const tierRewards = data.rewards.filter((r) => r.tier === tier)}
							{@const freeReward = tierRewards.find((r) => !r.isPremium)}
							{@const premiumReward = tierRewards.find((r) => r.isPremium)}
							{@const isUnlocked = currentTier >= tier}
							{@const isClaimable = (reward) => claimableRewards.some((r) => r.id === reward?.id)}
							
							<div class="tier-column flex flex-col items-center gap-2">
								<!-- Premium Reward -->
								<div 
									class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all {premiumReward ? (isUnlocked && isPremium ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-500/30 bg-yellow-500/5') : 'border-transparent'}"
									class:opacity-50={premiumReward && (!isUnlocked || !isPremium)}
								>
									{#if premiumReward}
										<Crown class="absolute -right-1 -top-1 h-5 w-5 text-yellow-500" />
										{#if isClaimable(premiumReward)}
											<button
												class="reward-claimable absolute inset-0 flex items-center justify-center rounded-xl bg-green-500/20"
												on:click={() => claimReward(premiumReward.id)}
											>
												<Gift class="h-8 w-8 text-green-400 animate-bounce" />
											</button>
										{:else}
											<Popover.Root>
												<Popover.Trigger>
													<div class="flex items-center justify-center p-2">
														{#if premiumReward.items?.id}
															<img 
																class="h-12 w-12 object-contain"
																src={`https://cdn.demonlistvn.com/items/${premiumReward.items.id}.webp`}
																alt={premiumReward.description}
															/>
														{:else}
															<Gift class="h-8 w-8" />
														{/if}
													</div>
												</Popover.Trigger>
												<Popover.Content class="w-48">
													<div class="text-center">
														<p class="font-medium">{premiumReward.description || 'Premium Reward'}</p>
														<p class="text-sm text-yellow-500">Premium Only</p>
													</div>
												</Popover.Content>
											</Popover.Root>
										{/if}
									{/if}
								</div>

								<!-- Tier Number -->
								<div 
									class="tier-number flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all {isUnlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' : 'bg-muted text-muted-foreground'}"
								>
									{tier}
								</div>

								<!-- Free Reward -->
								<div 
									class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all {freeReward ? (isUnlocked ? 'border-blue-500 bg-blue-500/10' : 'border-muted bg-muted/30') : 'border-transparent'}"
									class:opacity-50={freeReward && !isUnlocked}
								>
									{#if freeReward}
										{#if isClaimable(freeReward)}
											<button
												class="reward-claimable absolute inset-0 flex items-center justify-center rounded-xl bg-green-500/20"
												on:click={() => claimReward(freeReward.id)}
											>
												<Gift class="h-8 w-8 text-green-400 animate-bounce" />
											</button>
										{:else}
											<Popover.Root>
												<Popover.Trigger>
													<div class="flex items-center justify-center p-2">
														{#if freeReward.items?.id}
															<img 
																class="h-12 w-12 object-contain"
																src={`https://cdn.demonlistvn.com/items/${freeReward.items.id}.webp`}
																alt={freeReward.description}
															/>
														{:else}
															<Gift class="h-8 w-8" />
														{/if}
													</div>
												</Popover.Trigger>
												<Popover.Content class="w-48">
													<div class="text-center">
														<p class="font-medium">{freeReward.description || 'Free Reward'}</p>
														<p class="text-sm text-blue-400">Free Tier</p>
													</div>
												</Popover.Content>
											</Popover.Root>
										{/if}
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Tabs.Content>

			<!-- Levels Tab -->
			<Tabs.Content value="levels" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">Featured Levels</h2>
					<p class="text-muted-foreground">Complete these Extreme Demons for massive XP</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.levels as level}
						<Card.Root class="overflow-hidden border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5 transition-all hover:border-red-500/50">
							<Card.Header class="pb-2">
								<div class="flex items-center gap-3">
									<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
										<Star class="h-6 w-6 text-red-400" />
									</div>
									<div>
										<Card.Title class="text-lg">{level.levels?.name || `Level ${level.levelID}`}</Card.Title>
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
											<span class="text-sm text-muted-foreground">Progress ({level.minProgress}%)</span>
											<span class="font-medium text-blue-400">+{level.minProgressXp} XP</span>
										</div>
									{/if}
								</div>
							</Card.Content>
						</Card.Root>
					{:else}
						<div class="col-span-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
							<Star class="h-12 w-12" />
							<p>No featured levels yet</p>
						</div>
					{/each}
				</div>
			</Tabs.Content>

			<!-- Map Packs Tab -->
			<Tabs.Content value="mappacks" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">Map Packs</h2>
					<p class="text-muted-foreground">Complete all levels in a pack to earn XP</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.mapPacks as pack}
						{@const mapPack = pack.mapPacks}
						<Card.Root class="overflow-hidden border-2 transition-all hover:border-primary/50" style="border-color: {getDifficultyColor(mapPack?.difficulty)}40;">
							<Card.Header class="pb-2">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div class="flex h-12 w-12 items-center justify-center rounded-lg" style="background-color: {getDifficultyColor(mapPack?.difficulty)}20;">
											<Map class="h-6 w-6" style="color: {getDifficultyColor(mapPack?.difficulty)};" />
										</div>
										<div>
											<Card.Title class="text-lg">{mapPack?.name || 'Map Pack'}</Card.Title>
											<p class="text-sm" style="color: {getDifficultyColor(mapPack?.difficulty)};">{getDifficultyName(mapPack?.difficulty)}</p>
										</div>
									</div>
									<div class="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400">
										+{mapPack?.xp || 0} XP
									</div>
								</div>
							</Card.Header>
							<Card.Content>
								{#if mapPack?.description}
									<p class="mb-3 text-sm text-muted-foreground">{mapPack.description}</p>
								{/if}
								<div class="flex flex-col gap-2">
									{#each (mapPack?.mapPackLevels || []) as level}
										<div class="flex items-center gap-2 rounded-lg bg-muted/30 p-2">
											<div class="h-2 w-2 rounded-full bg-muted-foreground" />
											<span class="text-sm">{level.levels?.name || `Level ${level.levelID}`}</span>
										</div>
									{/each}
								</div>
								{#if pack.unlockWeek > 1}
									<div class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
										<Lock class="h-4 w-4" />
										<span>Unlocks Week {pack.unlockWeek}</span>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					{:else}
						<div class="col-span-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
							<Map class="h-12 w-12" />
							<p>No map packs available yet</p>
						</div>
					{/each}
				</div>
			</Tabs.Content>

			<!-- Missions Tab -->
			<Tabs.Content value="missions" class="w-full">
				<div class="mb-4 text-center">
					<h2 class="text-2xl font-bold">Missions</h2>
					<p class="text-muted-foreground">Complete special objectives for bonus XP and rewards</p>
				</div>

				<div class="flex flex-col gap-4">
					{#each data.missions as mission}
						{@const status = missionStatus[mission.id]}
						{@const isCompleted = status?.completed ?? mission.completed}
						{@const isClaimed = status?.claimed ?? mission.claimed}

						<Card.Root class="overflow-hidden border-2 transition-all {isCompleted && !isClaimed ? 'border-green-500/50 bg-green-500/5' : isClaimed ? 'border-muted opacity-60' : 'border-muted'}">
							<Card.Content class="flex items-center gap-4 p-4">
								<div class="flex h-14 w-14 items-center justify-center rounded-xl {isCompleted ? 'bg-green-500/20' : 'bg-muted'}">
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
											<div class="flex gap-1 justify-end mt-1">
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
												Claimed
											</Button>
										{:else if isCompleted}
											<Button 
												class="w-24 bg-green-500 hover:bg-green-600"
												on:click={() => claimMission(mission.id)}
											>
												Claim
											</Button>
										{:else}
											<Button variant="outline" disabled class="w-24">
												<Lock class="mr-1 h-4 w-4" />
												Locked
											</Button>
										{/if}
									{/if}
								</div>
							</Card.Content>
						</Card.Root>
					{:else}
						<div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
							<Target class="h-12 w-12" />
							<p>No missions available yet</p>
						</div>
					{/each}
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
{/if}

<style lang="scss">
	.hero-section {
		min-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-bg {
		background: linear-gradient(135deg, 
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

	.tier-track-container {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--muted)) transparent;
	}

	.tier-track-container::-webkit-scrollbar {
		height: 8px;
	}

	.tier-track-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.tier-track-container::-webkit-scrollbar-thumb {
		background-color: hsl(var(--muted));
		border-radius: 4px;
	}

	.reward-claimable {
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background-color: rgba(34, 197, 94, 0.3);
		}
	}

	.tier-column {
		min-width: 80px;
	}
</style>
