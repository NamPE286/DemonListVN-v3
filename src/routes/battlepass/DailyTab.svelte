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

	export let primaryColor: string = '#8b5cf6';
	export let isLoggedIn: boolean = false;
	export let dailyLevel: {
		id: number;
		name: string;
		difficulty: string;
		progress: number;
		completed: boolean;
		claimed: boolean;
		xp: number;
	};
	export let weeklyDemon: {
		id: number;
		name: string;
		difficulty: string;
		progress: number;
		completed: boolean;
		claimed: boolean;
		xp: number;
	};

	function getDifficultyColor(difficulty: string): string {
		return DIFFICULTY_COLORS[difficulty?.toLowerCase()] || '#6b7280';
	}

	function getDifficultyName(difficulty: string): string {
		return DIFFICULTY_NAMES[difficulty?.toLowerCase()] || difficulty || 'Unknown';
	}
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
						<Zap class="h-5 w-5" style="color: {primaryColor}" />
						<span class="font-bold" style="color: {primaryColor}">+{dailyLevel.xp} XP</span>
					</div>
					{#if isLoggedIn}
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
						<Zap class="h-5 w-5" style="color: {primaryColor}" />
						<span class="font-bold" style="color: {primaryColor}">+{weeklyDemon.xp} XP</span>
					</div>
					{#if isLoggedIn}
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
