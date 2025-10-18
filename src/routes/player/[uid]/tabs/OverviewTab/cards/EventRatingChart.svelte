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
	const INITIAL_RATING = 1500;

	// Calculate rating progression
	function calculateRatings() {
		if (!data.events || data.events.length === 0) {
			return { labels: [], ratings: [] };
		}

		// Sort events by date (oldest first)
		const sortedEvents = [...data.events]
			.filter((e) => e.accepted && e.events.isRanked && e.events.isContest)
			.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

		const labels: string[] = ['Start'];
		const ratings: number[] = [INITIAL_RATING];

		let currentRating = INITIAL_RATING;

		sortedEvents.forEach((event) => {
			currentRating += event.diff;
			labels.push(event.events.title);
			ratings.push(currentRating);
		});

		return { labels, ratings };
	}

	function createChart(node: any) {
		if (chart != null) {
			chart.destroy();
		}

		const { labels, ratings } = calculateRatings();

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
							display: true,
							text: 'Rating'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Events'
						},
						ticks: {
							maxRotation: 45,
							minRotation: 45
						}
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function (context) {
								return `Rating: ${context.parsed.y}`;
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
