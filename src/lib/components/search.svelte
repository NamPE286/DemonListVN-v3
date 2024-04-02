<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Avatar from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';

	export let toggled: boolean;
	export let value: string = '';

	let result: any = {
		levels: [],
		players: []
	};

	let state = 0;

	$: toggled && onChange();

	function onChange() {
		result = {
			levels: [],
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

		fetch(`${import.meta.env.VITE_API_URL}/search/${value}`)
			.then((res) => res.json())
			.then((res) => {
				result = res;
				state = 2;
			});
	}

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggled = !toggled;
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
		if (!toggled) {
			return;
		}

		if (e.key == 'Enter') {
			search();
		}
	}}
/>

<Command.Dialog bind:open={toggled}>
	<Command.Input bind:value placeholder="Type and press Enter to search..." />
	<Command.List>
		{#if state != 0}
			<Command.Empty>No results found.</Command.Empty>
			{#if result.levels.length}
				<Command.Group heading="Levels">
					{#each result.levels as item}
						<a href={`/level/${item.data.id}`}>
							<Command.Item>{item.data.name} by {item.data.creator}</Command.Item>
						</a>
					{/each}
				</Command.Group>
			{/if}
			{#if result.players.length}
				<Command.Separator />
				<Command.Group heading="Players">
					{#each result.players as item}
						<a href={`/player/${item.data.uid}`}>
							<Command.Item>
								<Avatar.Root>
									<Avatar.Image
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
		{/if}
	</Command.List>
</Command.Dialog>

<style lang="scss">
	.playerName {
		margin-left: 10px;
	}
</style>
