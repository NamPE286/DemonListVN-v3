<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import Map from 'lucide-svelte/icons/map';
	import Lock from 'lucide-svelte/icons/lock';
	import Check from 'lucide-svelte/icons/check';
	import { DIFFICULTY_COLORS, DIFFICULTY_NAMES } from '$lib/battlepass/constants';

	export let primaryColor: string = '#8b5cf6';

	let mapPacks: any[] = [];
	let mapPackProgress: Record<number, { completedLevels: number[]; claimed: boolean }> = {};
	let mapPackLevelProgress: Record<string, number> = {};
	let loading = true;
	let mounted = false;

	// Generate CSS variable strings
	$: cssVars = (() => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(primaryColor);
		if (!result) return '';
		const rgb = {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		};
		return `--primary-color: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
	})();

	let selectedMapPack: any = null;
	let mapPackDialogOpen = false;

	function openMapPackDialog(pack: any) {
		selectedMapPack = pack;
		mapPackDialogOpen = true;
	}

	function getDifficultyColor(difficulty: string): string {
		return DIFFICULTY_COLORS[difficulty?.toLowerCase()] || '#6b7280';
	}

	function getDifficultyName(difficulty: string): string {
		return DIFFICULTY_NAMES[difficulty?.toLowerCase()] || difficulty || 'Unknown';
	}

	function getMapPackLevelProgress(battlePassMapPackId: number, levelID: number): number {
		const key = `${battlePassMapPackId}_${levelID}`;
		return mapPackLevelProgress[key] ?? 0;
	}

	function isLevelCompleted(battlePassMapPackId: number, levelID: number): boolean {
		const progress = mapPackProgress[battlePassMapPackId];
		return progress?.completedLevels?.includes(levelID) ?? false;
	}

	function isMapPackCompleted(pack: any): boolean {
		const progress = mapPackProgress[pack.id];
		const totalLevels = pack.mapPacks?.mapPackLevels?.length || 0;
		return (progress?.completedLevels?.length ?? 0) >= totalLevels;
	}

	function isMapPackClaimed(pack: any): boolean {
		return mapPackProgress[pack.id]?.claimed ?? false;
	}

	function getMapPackCompletionPercent(pack: any): number {
		const progress = mapPackProgress[pack.id];
		const totalLevels = pack.mapPacks?.mapPackLevels?.length || 0;
		if (totalLevels === 0) return 0;
		return Math.round(((progress?.completedLevels?.length ?? 0) / totalLevels) * 100);
	}

	async function fetchMapPacks() {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappacks`);
			if (res.ok) {
				mapPacks = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch map packs:', e);
		}
	}

	async function fetchMapPackProgress() {
		if (!$user.loggedIn || mapPacks.length === 0) return;

		try {
			const mapPackIds = mapPacks.map((mp: any) => mp.id);
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
			mapPacks.forEach((mp: any) => {
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
				toast.success($_('battlepass.xp_claimed', { values: { xp: result.xp } }));
				await fetchMapPackProgress();
			} else {
				const error = await res.text();
				toast.error(error || $_('battlepass.claim_failed'));
			}
		} catch (e) {
			toast.error($_('battlepass.claim_failed'));
		}
	}

	async function loadData() {
		loading = true;
		await fetchMapPacks();
		if ($user.loggedIn) {
			await fetchMapPackProgress();
		}
		loading = false;
	}

	onMount(() => {
		mounted = true;
		loadData();

		const unsubscribe = user.subscribe(async (value) => {
			if (!mounted) return;

			if (value.loggedIn && mapPacks.length > 0) {
				await fetchMapPackProgress();
			} else if (!value.loggedIn) {
				mapPackProgress = {};
				mapPackLevelProgress = {};
			}
		});

		return () => {
			mounted = false;
			unsubscribe();
		};
	});
</script>

<div class="mb-4 text-center">
	<h2 class="text-2xl font-bold">{$_('battlepass.map_packs')}</h2>
	<p class="text-muted-foreground">{$_('battlepass.map_packs_desc')}</p>
</div>

{#if loading}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<Skeleton class="h-48 w-full" />
		<Skeleton class="h-48 w-full" />
		<Skeleton class="h-48 w-full" />
	</div>
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each mapPacks as pack}
			{@const mapPack = pack.mapPacks}
			{@const completionPercent = getMapPackCompletionPercent(pack)}
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
								class="rounded-full px-3 py-1 text-sm font-bold"
								style="background-color: rgba(var(--primary-color), 0.2); color: {primaryColor}"
							>
								+{mapPack?.xp || 0} XP
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						{#if mapPack?.description}
							<p class="mb-3 text-sm text-muted-foreground">{mapPack.description}</p>
						{/if}
						
						<!-- Map Pack Progress Bar -->
						{#if $user.loggedIn}
							<div class="mb-3 flex flex-col gap-2">
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">{$_('battlepass.progress')}</span>
									<span class="font-medium">{completionPercent}%</span>
								</div>
								<div class="h-2 overflow-hidden rounded-full bg-muted">
									<div
										class="h-full rounded-full transition-all"
										style="width: {completionPercent}%; background-color: {getDifficultyColor(mapPack?.difficulty)};"
									/>
								</div>
							</div>
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
{/if}

<!-- Map Pack Detail Dialog -->
<Dialog.Root bind:open={mapPackDialogOpen}>
	<Dialog.Content class="max-w-lg" style={cssVars}>
		{#if selectedMapPack}
			{@const mapPack = selectedMapPack.mapPacks}
			{@const isCompleted = isMapPackCompleted(selectedMapPack)}
			{@const isClaimed = isMapPackClaimed(selectedMapPack)}
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

				<div
					class="flex items-center justify-between rounded-lg p-3"
					style="background-color: rgba(var(--primary-color), 0.1);"
				>
					<span class="text-sm">{$_('battlepass.completion_xp')}</span>
					<span class="font-bold" style="color: {primaryColor}">+{mapPack?.xp || 0} XP</span>
				</div>

				<div>
					<h4 class="mb-2 font-medium">{$_('battlepass.levels_list')}</h4>
					<div class="flex flex-col gap-2">
						{#each mapPack?.mapPackLevels || [] as level, i}
							{@const levelCompleted = isLevelCompleted(selectedMapPack.id, level.levelID)}
							{@const levelProg = getMapPackLevelProgress(selectedMapPack.id, level.levelID)}
							<div class="flex flex-col gap-2 rounded-lg bg-muted/30 p-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium {levelCompleted ? 'bg-green-500 text-white' : 'bg-muted'}"
										>
											{#if levelCompleted}
												<Check class="h-4 w-4" />
											{:else}
												{i + 1}
											{/if}
										</div>
										<div>
											<span class="font-medium"
												>{level.levels?.name || `Level ${level.levelID}`}</span
											>
											<p class="text-xs text-muted-foreground">ID: {level.levelID}</p>
										</div>
									</div>
								</div>
								<!-- Level Progress Bar -->
								{#if $user.loggedIn && !levelCompleted}
									<div class="flex items-center gap-2">
										<div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
											<div
												class="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all"
												style="width: {levelProg}%"
											/>
										</div>
										<span class="text-xs text-muted-foreground">{levelProg}%</span>
									</div>
								{/if}
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
				{#if $user.loggedIn && isCompleted && !isClaimed}
					<Button 
						class="bg-green-500 hover:bg-green-600"
						on:click={() => {
							claimMapPack(selectedMapPack.id);
							mapPackDialogOpen = false;
						}}
					>
						{$_('battlepass.claim')} +{mapPack?.xp || 0} XP
					</Button>
				{:else if isClaimed}
					<Button variant="outline" disabled>
						<Check class="mr-1 h-4 w-4" />
						{$_('battlepass.claimed')}
					</Button>
				{/if}
				<Button variant="outline" on:click={() => (mapPackDialogOpen = false)}>
					{$_('general.close')}
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
