<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { onMount } from 'svelte';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import type { Level } from './type';
	import Button from '$lib/components/ui/button/button.svelte';
	import { user } from '$lib/client';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	export let levels: Level[];

	let leaderboard: any[] = [];

	function indexToRoman(num: number): string {
		const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
		const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
		let result = '';
		for (let i = 0; i < values.length; i++) {
			while (num >= values[i]) {
				num -= values[i];
				result += romanNumerals[i];
			}
		}
		return result;
	}

	function getPoint(record: any, index: number) {
		if (record === null) {
			return 0;
		}

		return (record.progress / 100) * levels[index].point;
	}

	function getTotalPoint(records: any[]) {
		let res = 0;

		for (let i = 0; i < records.length; i++) {
			res += getPoint(records[i], i);
		}

		return res;
	}

	onMount(async () => {
		leaderboard = await (await fetch(`${import.meta.env.VITE_API_URL}/event/8/leaderboard`)).json();
	});
</script>

<div class="flex justify-center mb-[10px]">
	<a href="#me">
		<Button class="w-[200px]" variant="outline">Jump to me</Button>
	</a>
</div>
<Table.Root class="ml-auto mr-auto w-[1500px] max-w-full">
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Rank</Table.Head>
			<Table.Head class="min-w-[200px]">Player</Table.Head>
			{#each levels as level, index}
				<Table.Head class="w-[75px] text-center">
					<Tooltip.Root>
						<Tooltip.Trigger>
							{indexToRoman(index + 1)}
						</Tooltip.Trigger>
						<Tooltip.Content>{level.name}</Tooltip.Content>
					</Tooltip.Root>
				</Table.Head>
			{/each}
			<Table.Head class="w-[75px] text-right">Total</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each leaderboard as player, rank}
			<Table.Row>
				{#if player.uid == $user.data.uid}
					<Table.Cell class="font-medium text-yellow-500">#{rank + 1}</Table.Cell>
				{:else}
					<Table.Cell class="font-medium">#{rank + 1}</Table.Cell>
				{/if}
				<Table.Cell class="min-w-[200px]">
					{#if player.uid == $user.data.uid}
						<div id="me">
							<PlayerHoverCard {player} />
						</div>
					{:else}
						<PlayerHoverCard {player} />
					{/if}
				</Table.Cell>
				{#each player.eventRecords as record, index}
					<Table.Cell class="w-[75px] text-center">
						{getPoint(record, index)}<br />
						<span class="text-[11px] opacity-50">
							{record ? `${record.progress}%` : ''}
						</span>
					</Table.Cell>
				{/each}
				<Table.Cell class="w-[75px] text-right">
					{getTotalPoint(player.eventRecords)}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
