<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onMount } from 'svelte';

	export let uid: string;
	let year: number = new Date().getFullYear();
	let data: number[] = Array(366).fill(0);

	function daysInMonth(year: number, month: number) {
		return new Date(year, month, 0).getDate();
	}

	function monthOffset(year: number, month: number) {
		let x = new Date(year, month, 1).getDay();
		return (x - 1 + 7) % 7;
	}

	function dayOfYear(year: number, month: number, date: number) {
		let x = new Date(year, 0, 1).getTime();
		let y = new Date(year, month, date).getTime();

		return Math.floor((y - x) / 86400000);
	}

	function getColor(x: number) {
		if (data[x] == 0) {
			return 'rgba(128, 128, 128, 0.2)';
		}

		let opacity = data[x] / 2500;
		opacity = Math.max(opacity, 0.1);
		opacity = Math.min(opacity, 1);

		return `rgba(0, 255, 0, ${opacity})`;
	}

	onMount(async () => {
		fetch(`${import.meta.env.VITE_API_URL}/player/${uid}/heatmap`)
			.then((res) => res.json())
			.then((res) => {
				data = res.days;
			});
	});
</script>

<div class="heatmapWrapper">
	{#key data}
		{#each { length: 12 } as _, month}
			<div class="month">
				{#each { length: monthOffset(year, month) } as item}
					<div class="emptyCell" />
				{/each}
				{#each { length: daysInMonth(year, month + 1) } as item, date}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div
								class="cell"
								style={`background-color: ${getColor(dayOfYear(year, month, date + 1))}`}
							/>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>
								{new Date(year, month, date + 1).toLocaleDateString('en-IN')}
								({data[dayOfYear(year, month, date + 1)]} attempts)
							</p>
						</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</div>
		{/each}
	{/key}
</div>

<style lang="scss">
	.heatmapWrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 11px;
	}
	.month {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		height: calc(13px * 7);
		width: fit-content;
		gap: 1px;
	}

	.cell {
		height: 12px;
		width: 12px;
		border-radius: 3px;
	}

	.emptyCell {
		height: 12px;
		width: 12px;
		border-radius: 5px;
	}
</style>
