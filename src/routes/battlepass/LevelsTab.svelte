<script lang="ts">
	import { _ } from 'svelte-i18n';
	import * as Card from '$lib/components/ui/card/index.js';
	import Star from 'lucide-svelte/icons/star';
	import Zap from 'lucide-svelte/icons/zap';

	export let levels: any[] = [];
	export let levelProgress: Record<number, number> = {};
	export let primaryColor: string = '#8b5cf6';

	function getProgress(battlePassLevelId: number): number {
		return levelProgress[battlePassLevelId] ?? 0;
	}
</script>

<div class="mb-4 text-center">
	<h2 class="text-2xl font-bold">{$_('battlepass.featured_levels')}</h2>
	<p class="text-muted-foreground">{$_('battlepass.featured_levels_desc')}</p>
</div>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each levels as level}
		{@const progress = getProgress(level.id)}
		<Card.Root
			class="overflow-hidden border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5 transition-all hover:border-red-500/50"
		>
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
					<!-- Progress Bar -->
					<div class="flex flex-col gap-2">
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">{$_('battlepass.progress')}</span>
							<span class="font-medium">{progress}%</span>
						</div>
						<div class="h-3 overflow-hidden rounded-full bg-muted">
							<div
								class="h-full rounded-full bg-gradient-to-r from-red-400 to-orange-400 transition-all"
								style="width: {progress}%"
							/>
						</div>
					</div>

					<div class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
						<span class="text-sm text-muted-foreground">{$_('battlepass.completion_xp')}</span>
						<div class="flex items-center gap-1">
							<Zap class="h-4 w-4" style="color: {primaryColor}" />
							<span class="font-bold" style="color: {primaryColor}">+{level.xp} XP</span>
						</div>
					</div>
					{#if level.minProgress && level.minProgressXp && level.minProgress !== 100}
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
