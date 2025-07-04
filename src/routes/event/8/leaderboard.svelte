<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import type { Level } from './type';

	export let levels: Level[];

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
</script>

<Table.Root class="ml-auto mr-auto w-[1500px]">
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Rank</Table.Head>
			<Table.Head>Player</Table.Head>
			{#each levels as level, index}
				<Table.Head class="w-[75px] text-center">{indexToRoman(index + 1)}</Table.Head>
			{/each}
			<Table.Head class="w-[75px] text-right">Total</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row>
			<Table.Cell class="font-medium">#1</Table.Cell>
			<Table.Cell>Player</Table.Cell>
			{#each levels as level, index}
				<Table.Cell class="w-[75px] text-center">{level.point}</Table.Cell>
			{/each}
			<Table.Cell class="w-[75px] text-right">1000</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>
