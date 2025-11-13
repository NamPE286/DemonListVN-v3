<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Loading from '$lib/components/animation/loading.svelte';
	import { isActive } from '$lib/client/isSupporterActive';
	import { Search, X } from 'lucide-svelte';

	export let open = false;
	export let title = 'Select Player';

	let searchValue = '';
	let searchResults: any[] = [];
	let isSearching = false;
	let searchTimeout: any = null;

	const dispatch = createEventDispatcher();

	async function searchPlayers() {
		if (searchValue.length < 2) {
			searchResults = [];
			return;
		}

		isSearching = true;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/search/${searchValue}`);
			const data = await res.json();
			searchResults = data.players || [];
		} catch (err) {
			searchResults = [];
		}
		isSearching = false;
	}

	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			searchPlayers();
		}, 300);
	}

	function selectPlayer(player: any) {
		dispatch('select', player);
		closeDialog();
	}

	function closeDialog() {
		open = false;
		searchValue = '';
		searchResults = [];
	}

	$: searchValue, handleSearchInput();
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => !isOpen && closeDialog()}>
	<Dialog.Content class="max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>Search for a player by name or Discord ID</Dialog.Description>
		</Dialog.Header>

		<div class="search-container">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					bind:value={searchValue}
					placeholder="Type player name or discord:USER_ID..."
					class="pl-10 pr-10"
				/>
				{#if searchValue}
					<button
						on:click={() => (searchValue = '')}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<X class="h-4 w-4" />
					</button>
				{/if}
			</div>

			<div class="results-container">
				{#if isSearching}
					<div class="flex items-center justify-center py-12">
						<Loading inverted={true} />
					</div>
				{:else if searchValue.length < 2}
					<div class="empty-state">
						<Search class="h-12 w-12 text-muted-foreground opacity-50" />
						<p class="text-muted-foreground">Start typing to search for players...</p>
					</div>
				{:else if searchResults.length === 0}
					<div class="empty-state">
						<p class="text-muted-foreground">No players found</p>
						<p class="text-sm text-muted-foreground">
							Try searching with a different name or use <code>discord:USER_ID</code>
						</p>
					</div>
				{:else}
					<ScrollArea class="h-[400px]">
						<div class="player-list">
							{#each searchResults as player}
								<button
									class="player-item"
									on:click={() => selectPlayer(player)}
									type="button"
								>
									<Avatar.Root class="h-12 w-12">
										<Avatar.Image
											class="object-cover"
											src={`https://cdn.demonlistvn.com/avatars/${player.uid}${
												isActive(player.supporterUntil) && player.isAvatarGif ? '.gif' : '.jpg'
											}`}
											alt={player.name}
										/>
										<Avatar.Fallback>{player.name[0]}</Avatar.Fallback>
									</Avatar.Root>
									<div class="player-info">
										<h4 class={isActive(player.supporterUntil) ? 'text-yellow-500' : ''}>
											{player.name}
											{#if player.clan && player.clans}
												<span class="clan-tag">[{player.clans.tag}]</span>
											{/if}
										</h4>
										<div class="player-stats">
											{#if player.rating}
												<span class="stat">Rating: {player.rating}</span>
											{/if}
											{#if player.overallRank}
												<span class="stat">Rank: #{player.overallRank}</span>
											{/if}
											{#if player.province}
												<span class="stat">{player.province}</span>
											{/if}
										</div>
									</div>
								</button>
							{/each}
						</div>
					</ScrollArea>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.search-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.results-container {
		min-height: 400px;
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 400px;
		gap: 0.5rem;
		padding: 2rem;
		text-align: center;

		code {
			background-color: hsl(var(--muted));
			padding: 0.125rem 0.375rem;
			border-radius: 0.25rem;
			font-size: 0.875rem;
			font-family: monospace;
		}
	}

	.player-list {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		gap: 0.5rem;
	}

	.player-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid transparent;
		background-color: transparent;
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
		text-align: left;

		&:hover {
			background-color: hsl(var(--muted) / 0.5);
			border-color: hsl(var(--border));
		}

		&:active {
			background-color: hsl(var(--muted));
		}
	}

	.player-info {
		flex: 1;
		min-width: 0;

		h4 {
			font-weight: 600;
			font-size: 1rem;
			margin-bottom: 0.25rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			.clan-tag {
				color: hsl(var(--muted-foreground));
				font-weight: 500;
				margin-left: 0.25rem;
			}
		}
	}

	.player-stats {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;

		.stat {
			font-size: 0.875rem;
			color: hsl(var(--muted-foreground));
			white-space: nowrap;
		}
	}

	@media screen and (max-width: 640px) {
		.player-item {
			gap: 0.75rem;
			padding: 0.5rem;
		}

		.player-stats {
			gap: 0.5rem;

			.stat {
				font-size: 0.75rem;
			}
		}
	}
</style>
