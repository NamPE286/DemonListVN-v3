<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Zap from 'lucide-svelte/icons/zap';
	import Check from 'lucide-svelte/icons/check';
	import Lock from 'lucide-svelte/icons/lock';
	import { DIFFICULTY_COLORS, DIFFICULTY_NAMES } from '$lib/battlepass/constants';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		claim: { levelId: number; claimType: 'minProgress' | 'completion' }
	}>();

	export let primaryColor: string = '#8b5cf6';
	export let isLoggedIn: boolean = false;
	export let dailyLevel: {
		id: number;
		levelId: number;
		name: string;
		difficulty: string;
		progress: number;
		completed: boolean;
		claimed: boolean;
		minProgressClaimed: boolean;
		minProgress: number;
		minProgressXp: number;
		xp: number;
	};
	export let weeklyDemon: {
		id: number;
		levelId: number;
		name: string;
		difficulty: string;
		progress: number;
		completed: boolean;
		claimed: boolean;
		minProgressClaimed: boolean;
		minProgress: number;
		minProgressXp: number;
		xp: number;
	};

	function getDifficultyColor(difficulty: string): string {
		return DIFFICULTY_COLORS[difficulty?.toLowerCase()] || '#6b7280';
	}

	function getDifficultyName(difficulty: string): string {
		return DIFFICULTY_NAMES[difficulty?.toLowerCase()] || difficulty || 'Unknown';
	}

	function handleClaim(levelId: number, claimType: 'minProgress' | 'completion') {
		dispatch('claim', { levelId, claimType });
	}

	// Check if min progress is reached
	$: dailyMinProgressReached = dailyLevel.progress >= dailyLevel.minProgress;
	$: weeklyMinProgressReached = weeklyDemon.progress >= weeklyDemon.minProgress;
</script>

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
			{#if dailyLevel.id === 0}
				<div class="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
					<Sun class="mb-2 h-12 w-12 opacity-50" />
					<p>{$_('battlepass.no_daily_level')}</p>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					<div class="rounded-lg bg-muted/30 p-4">
						<div class="mb-2 flex items-center justify-between">
							<span class="font-medium">{dailyLevel.name}</span>
							<span class="text-sm text-muted-foreground">ID: {dailyLevel.levelId}</span>
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

					<!-- Min Progress Reward (hidden when minProgress === 100) -->
					{#if dailyLevel.minProgress && dailyLevel.minProgress !== 100}
						<div class="flex items-center justify-between rounded-lg bg-muted/20 p-3">
							<div class="flex flex-col">
								<span class="text-sm text-muted-foreground">{$_('battlepass.min_progress_reward', { values: { progress: dailyLevel.minProgress } })}</span>
								<div class="flex items-center gap-1">
									<Zap class="h-4 w-4" style="color: {primaryColor}" />
									<span class="font-bold" style="color: {primaryColor}">+{dailyLevel.minProgressXp} XP</span>
								</div>
							</div>
							{#if isLoggedIn}
								{#if dailyLevel.minProgressClaimed}
									<Button variant="outline" disabled size="sm">
										<Check class="mr-1 h-4 w-4" />
										{$_('battlepass.claimed')}
									</Button>
								{:else if dailyMinProgressReached}
									<Button size="sm" class="bg-green-500 hover:bg-green-600" on:click={() => handleClaim(dailyLevel.id, 'minProgress')}>
										{$_('battlepass.claim')}
									</Button>
								{:else}
									<Button variant="outline" disabled size="sm">
										<Lock class="mr-1 h-4 w-4" />
										{dailyLevel.progress}/{dailyLevel.minProgress}%
									</Button>
								{/if}
							{/if}
						</div>
					{/if}

					<!-- Completion Reward -->
					<div class="flex items-center justify-between rounded-lg bg-muted/20 p-3">
						<div class="flex flex-col">
							<span class="text-sm text-muted-foreground">{$_('battlepass.completion_reward')}</span>
							<div class="flex items-center gap-1">
								<Zap class="h-4 w-4" style="color: {primaryColor}" />
								<span class="font-bold" style="color: {primaryColor}">+{dailyLevel.xp} XP</span>
							</div>
						</div>
						{#if isLoggedIn}
							{#if dailyLevel.claimed}
								<Button variant="outline" disabled size="sm">
									<Check class="mr-1 h-4 w-4" />
									{$_('battlepass.claimed')}
								</Button>
							{:else if dailyLevel.completed}
								<Button size="sm" class="bg-green-500 hover:bg-green-600" on:click={() => handleClaim(dailyLevel.id, 'completion')}>
									{$_('battlepass.claim')}
								</Button>
							{:else}
								<Button variant="outline" disabled size="sm">
									<Lock class="mr-1 h-4 w-4" />
									{dailyLevel.progress}/100%
								</Button>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
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
			{#if weeklyDemon.id === 0}
				<div class="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
					<Calendar class="mb-2 h-12 w-12 opacity-50" />
					<p>{$_('battlepass.no_weekly_level')}</p>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					<div class="rounded-lg bg-muted/30 p-4">
						<div class="mb-2 flex items-center justify-between">
							<span class="font-medium">{weeklyDemon.name}</span>
							<span class="text-sm text-muted-foreground">ID: {weeklyDemon.levelId}</span>
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

					<!-- Min Progress Reward (hidden when minProgress === 100) -->
					{#if weeklyDemon.minProgress && weeklyDemon.minProgress !== 100}
						<div class="flex items-center justify-between rounded-lg bg-muted/20 p-3">
							<div class="flex flex-col">
								<span class="text-sm text-muted-foreground">{$_('battlepass.min_progress_reward', { values: { progress: weeklyDemon.minProgress } })}</span>
								<div class="flex items-center gap-1">
									<Zap class="h-4 w-4" style="color: {primaryColor}" />
									<span class="font-bold" style="color: {primaryColor}">+{weeklyDemon.minProgressXp} XP</span>
								</div>
							</div>
							{#if isLoggedIn}
								{#if weeklyDemon.minProgressClaimed}
									<Button variant="outline" disabled size="sm">
										<Check class="mr-1 h-4 w-4" />
										{$_('battlepass.claimed')}
									</Button>
								{:else if weeklyMinProgressReached}
									<Button size="sm" class="bg-green-500 hover:bg-green-600" on:click={() => handleClaim(weeklyDemon.id, 'minProgress')}>
										{$_('battlepass.claim')}
									</Button>
								{:else}
									<Button variant="outline" disabled size="sm">
										<Lock class="mr-1 h-4 w-4" />
										{weeklyDemon.progress}/{weeklyDemon.minProgress}%
									</Button>
								{/if}
							{/if}
						</div>
					{/if}

					<!-- Completion Reward -->
					<div class="flex items-center justify-between rounded-lg bg-muted/20 p-3">
						<div class="flex flex-col">
							<span class="text-sm text-muted-foreground">{$_('battlepass.completion_reward')}</span>
							<div class="flex items-center gap-1">
								<Zap class="h-4 w-4" style="color: {primaryColor}" />
								<span class="font-bold" style="color: {primaryColor}">+{weeklyDemon.xp} XP</span>
							</div>
						</div>
						{#if isLoggedIn}
							{#if weeklyDemon.claimed}
								<Button variant="outline" disabled size="sm">
									<Check class="mr-1 h-4 w-4" />
									{$_('battlepass.claimed')}
								</Button>
							{:else if weeklyDemon.completed}
								<Button size="sm" class="bg-green-500 hover:bg-green-600" on:click={() => handleClaim(weeklyDemon.id, 'completion')}>
									{$_('battlepass.claim')}
								</Button>
							{:else}
								<Button variant="outline" disabled size="sm">
									<Lock class="mr-1 h-4 w-4" />
									{weeklyDemon.progress}/100%
								</Button>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
