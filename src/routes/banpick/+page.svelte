<script lang="ts">
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;

	let banned = Array(data.levels.length).fill(false);
	let order = Array(data.levels.length).fill(0);
	let phase = 0;

	function ban(index: number) {
		banned[index] = true;
		phase++;
	}

	function pick(index: number) {
		order[index] = phase - 2;
		phase++;
	}

	function formatOrder(x: number) {
		if (x == 1) {
			return '1st';
		}

		if (x == 2) {
			return '2nd';
		}

		if (x == 3) {
			return 'Tiebreaker';
		}
	}
</script>

<div class="mt-[50px] flex justify-center gap-[50px] text-xl">
	<PlayerHoverCard player={data.players[0]} showTitle={true} />
	<span class="font-bold">VS</span>
	<PlayerHoverCard player={data.players[1]} showTitle={true} />
</div>

<div class="mt-[100px] flex flex-col items-center gap-[10px]">
	{#each data.levels as level, index}
		<div
			class="flex w-[500px] items-center rounded-md border-[1px] p-[10px]"
		>
			<div class="text-bold">
				<b>{level.name}</b> <span class="text-sm opacity-50">by {level.author}</span><br />
				<span class="text-sm">{level.difficulty}</span>
			</div>
			{#if banned[index]}
				<Button variant="destructive" class="ml-auto" disabled>Banned</Button>
			{:else if order[index]}
				<Button class="ml-auto" disabled>{formatOrder(order[index])} level picked</Button>
			{:else if phase < 3}
				<Button variant="destructive" class="ml-auto" on:click={() => ban(index)}>Ban</Button>
			{:else}
				<Button class="ml-auto" on:click={() => pick(index)}>Pick</Button>
			{/if}
		</div>
	{/each}
</div>
