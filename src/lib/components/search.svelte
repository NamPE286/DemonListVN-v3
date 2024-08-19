<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Avatar from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Loading from '$lib/components/animation/loading.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { toast } from 'svelte-sonner';

	export let open: boolean;
	export let value: string = '';

	let result: any = {
		levels: [],
		gdBrowserLevels: [],
		players: []
	};

	let state = 0;

	$: $page.url, close();
	$: open && onChange();

	function close() {
		open = false;
	}

	function onChange() {
		result = {
			levels: [],
			gdBrowserLevels: [],
			players: []
		};

		value = '';
		state = 0;
	}

	async function search() {
		if (value == '') {
			return;
		}

		state = 1;

		Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/search/${value}`).then((res) => res.json()),
			fetch(`https://gdbrowser.com/api/search/${value}?page=0&count=5&diff=-2`).then((res) =>
				res.json()
			)
		])
			.then((res) => {
				if (!res[0] || !res[1]) {
					return;
				}

				result = {
					levels: res[0].levels,
					gdBrowserLevels: [],
					players: res[0].players
				};

				for (let i of res[1]) {
					result.gdBrowserLevels.push({
						data: {
							id: i.id,
							name: i.name,
							creator: i.author,
							other: true
						}
					});
				}

				state = 2;
			})
			.catch((err) => {
				state = 2;
			});
	}

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (!open) {
			return;
		}

		if (e.key == 'Enter') {
			if (state == 0) {
				search();
			}
		}
	}}
/>

<Command.Dialog bind:open>
	<Command.Input bind:value placeholder="Type and press Enter to search..." disabled={state != 0} />
	<Command.List>
		{#if state != 0}
			{#if state != 1}
				<Command.Empty>No results found.</Command.Empty>
			{:else}
				<Command.Empty>
					<Loading inverted={true} />
				</Command.Empty>
			{/if}
			<Command.Group heading="Levels from Demon List VN">
				{#each result.levels as item}
					<ContextMenu.Root>
						<ContextMenu.Trigger>
							{#if 'other' in item.data}
								<a href={`/level/${item.data.id}?list=other`} data-sveltekit-preload-data="tap">
									<Command.Item
										>{item.data.name} by {item.data.creator} ({item.data.id}) (Not added)</Command.Item
									>
								</a>
							{:else}
								<a href={`/level/${item.data.id}`} data-sveltekit-preload-data="tap">
									<Command.Item
										>{item.data.name} by {item.data.creator} ({item.data.id})</Command.Item
									>
								</a>
							{/if}
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item
								on:click={async () => {
									await navigator.clipboard.writeText(item.data.id);
									toast.success('Copied to clipboard!');
								}}>Copy level's ID</ContextMenu.Item
							>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			</Command.Group>
			<Command.Group heading="Levels from Geometry Dash">
				{#each result.gdBrowserLevels as item}
					<ContextMenu.Root>
						<ContextMenu.Trigger>
							{#if 'other' in item.data}
								<a href={`/level/${item.data.id}?list=other`} data-sveltekit-preload-data="tap">
									<Command.Item
										>{item.data.name} by {item.data.creator} ({item.data.id})</Command.Item
									>
								</a>
							{:else}
								<a href={`/level/${item.data.id}`} data-sveltekit-preload-data="tap">
									<Command.Item
										>{item.data.name} by {item.data.creator} ({item.data.id})</Command.Item
									>
								</a>
							{/if}
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item
								on:click={async () => {
									await navigator.clipboard.writeText(item.data.id);
									toast.success('Copied to clipboard!');
								}}>Copy level's ID</ContextMenu.Item
							>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Players">
				{#each result.players as item}
					<a href={`/player/${item.data.uid}`} data-sveltekit-preload-data="tap">
						<Command.Item>
							<Avatar.Root>
								<Avatar.Image
									class="object-cover"
									src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${item.data.uid}.jpg`}
									alt="@shadcn"
								/>
								<Avatar.Fallback>{item.data.name[0]}</Avatar.Fallback>
							</Avatar.Root>
							<span class="playerName">{item.data.name}</span>
						</Command.Item>
					</a>
				{/each}
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>

<style lang="scss">
	.playerName {
		margin-left: 10px;
	}
</style>
