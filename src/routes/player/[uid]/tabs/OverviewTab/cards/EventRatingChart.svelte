<script lang="ts">
	import BaseCard from './BaseCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { _ } from 'svelte-i18n';
	import type { CardConfig } from './types';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import { isActive } from '$lib/client/isSupporterActive';
	import { getBorderStyle } from './getBorderStyle';

	Chart.register(annotationPlugin);

	export let data: any;
	export let cardConfigs: CardConfig[];
	export let config: CardConfig;
	export let draggedCard: string | null;
	export let isCustomizing: boolean = false;

	let chart: any = null;
	let diffData: (number | null)[] = [];
	let eventTitles: string[] = [];
	const INITIAL_RATING = 1500;

	const eloRanks = [
		{ min: 3500, max: Infinity, color: 'rgba(170, 0, 0, 0.15)', label: 'Legendary Grandmaster' },
		{ min: 3000, max: 3500, color: 'rgba(255, 51, 51, 0.15)', label: 'International Grandmaster' },
		{ min: 2500, max: 3000, color: 'rgba(255, 128, 0, 0.15)', label: 'Grandmaster' },
		{ min: 2000, max: 2500, color: 'rgba(170, 0, 170, 0.15)', label: 'Master' },
		{ min: 1500, max: 2000, color: 'rgba(0, 128, 255, 0.15)', label: 'Expert' },
		{ min: 1000, max: 1500, color: 'rgba(0, 200, 150, 0.15)', label: 'Specialist' },
		{ min: 500, max: 1000, color: 'rgba(100, 200, 100, 0.15)', label: 'Pupil' },
		{ min: 0, max: 500, color: 'rgba(150, 150, 150, 0.15)', label: 'Newbie' }
	];

	const backgroundColorPlugin = {
		id: 'backgroundColorPlugin',
		beforeDraw: (chart: any) => {
			const ctx = chart.ctx;
			const chartArea = chart.chartArea;
			const yScale = chart.scales.y;

			if (!chartArea || !yScale) return;

			ctx.save();

			eloRanks.forEach((rank) => {
				const yTop = yScale.getPixelForValue(Math.min(rank.max, yScale.max));
				const yBottom = yScale.getPixelForValue(Math.max(rank.min, yScale.min));

				if (yBottom > chartArea.top && yTop < chartArea.bottom) {
					ctx.fillStyle = rank.color;
					ctx.fillRect(
						chartArea.left,
						Math.max(yTop, chartArea.top),
						chartArea.right - chartArea.left,
						Math.min(yBottom, chartArea.bottom) - Math.max(yTop, chartArea.top)
					);
				}
			});

			ctx.restore();
		}
	};

	function calculateRatings() {
		const labels: string[] = ['Initial'];
		const ratings: number[] = [INITIAL_RATING];
		const diffs: (number | null)[] = [null];
		const titles: string[] = [];

		for (const i of [...data.events].reverse()) {
			if (!(i.events.isContest && i.events.isRanked && i.diff !== null)) {
				continue;
			}

			labels.push(i.events.start);
			ratings.push(ratings.at(-1) + i.diff);
			diffs.push(i.diff);
			titles.push(i.events.title);
		}

		return {
			labels: labels.slice(1),
			ratings: ratings.slice(1),
			diffs: diffs.slice(1),
			titles: titles
		};
	}

	function createChart(node: any) {
		if (chart != null) {
			chart.destroy();
		}

		const { labels, ratings, diffs, titles } = calculateRatings();
		diffData = diffs;
		eventTitles = titles;

		chart = new Chart(node, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Rating',
						data: ratings,
						borderColor: data.player.borderColor,
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
						},
						type: 'time'
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							title: function (context) {
								const eventTitle = eventTitles[context[0].dataIndex];
								return eventTitle || '';
							},
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
						display: false,
						position: 'top'
					}
				}
			},
			plugins: [backgroundColorPlugin]
		});
	}
</script>

<BaseCard bind:draggedCard bind:cardConfigs bind:config bind:isCustomizing>
	<Card.Root class="h-full" style={getBorderStyle(data.player)}>
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
