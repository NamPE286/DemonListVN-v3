<script lang="ts">
	import BaseCard from './BaseCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import type { CardConfig } from './types';

	export let data: any;
	export let cardConfigs: CardConfig[];
	export let config: CardConfig;
	export let draggedCard: string | null;
	export let isCustomizing: boolean = false;

	let chart: any = null;
	let diffData: (number | null)[] = [];
	const INITIAL_RATING = 1500;

	function calculateRatings() {
		const labels: string[] = ['Initial'];
		const ratings: number[] = [INITIAL_RATING];
		const diffs: (number | null)[] = [null];

		for (const i of [...data.events].reverse()) {
			if (!(i.events.isContest && i.events.isRanked && i.diff !== null)) {
				continue;
			}

			labels.push(i.events.title);
			ratings.push(ratings.at(-1) + i.diff);
			diffs.push(i.diff);
		}

		return { labels, ratings, diffs };
	}

	function createChart(node: any) {
		if (chart != null) {
			chart.destroy();
		}

		const { labels, ratings, diffs } = calculateRatings();
		diffData = diffs;

		chart = new Chart(node, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Rating',
						data: ratings,
						borderColor: 'rgb(75, 192, 192)',
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						tension: 0.1,
						fill: true,
						pointRadius: 5,
						pointHoverRadius: 7
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: false,
						title: {
							display: false,
							text: 'Rating'
						}
					},
					x: {
						title: {
							display: false,
							text: 'Events'
						},
						ticks: {
							display: false,
							maxRotation: 45,
							minRotation: 45
						}
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function (context) {
								const diff = diffData[context.dataIndex];
								const rating = context.parsed.y;

								if (diff === null) {
									return `Rating: ${rating}`;
								}

								const diffStr = diff >= 0 ? `+${diff}` : `${diff}`;
								return [`Rating: ${rating}`, `Change: ${diffStr}`];
							}
						}
					},
					legend: {
						display: true,
						position: 'top'
					}
				}
			}
		});
	}

	onMount(() => {
		// Chart will be created when the canvas element is mounted
	});
</script>

<BaseCard bind:draggedCard bind:cardConfigs bind:config bind:isCustomizing>
	<Card.Root class="h-full">
		<Card.Header>
			<Card.Title class="text-lg">{$_('player.overview.event_rating')}</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if data.events && data.events.length > 0}
				<div class="chart-wrapper">
					<canvas use:createChart />
				</div>
			{:else}
				<div class="no-data">
					<p>{$_('player.overview.no_event_data')}</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</BaseCard>

<style lang="scss">
	.chart-wrapper {
		width: 100%;
		height: 250px;
		position: relative;
	}

	.no-data {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 150px;
		opacity: 0.6;
	}

	.no-data p {
		font-size: 1rem;
	}
</style>
