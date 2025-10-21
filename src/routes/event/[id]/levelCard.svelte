<script lang="ts">
	import type { Level } from './type';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';
	import { Copy } from 'svelte-radix';
	import { isActive } from '$lib/client/isSupporterActive';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	interface SubmitData {
		levelID: number | null;
		progress: number | null;
		videoLink: string;
		raw: string;
	}

	export let level: Level | null;
	export let index: number;
	export let records: any[];
	export let event: any;

	let submitData: SubmitData = {
		levelID: level ? level.id : 0,
		progress: null,
		videoLink: '',
		raw: ''
	};

	let deathCount: number[] = [];
	let chart: any = null;

	function isEventEnded() {
		return new Date(event.end) < new Date();
	}

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

	async function submit() {
		if (level === null) {
			return;
		}

		if (!submitData.progress || !submitData.videoLink) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (level.needRaw && !submitData.raw) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!(0 < submitData.progress && submitData.progress <= 100)) {
			toast.error('Invalid progress');
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/submit`, {
				method: 'POST',
				body: JSON.stringify(submitData),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					window.location.reload();
					return 'Submitted!';
				},
				error: 'Failed to submit',
				loading: 'Submitting...'
			}
		);
	}

	async function cancel() {
		if (level === null) {
			return;
		}

		if (!confirm('Cancel submission? This cannot be undone')) {
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/submission/${level.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			}),
			{
				success: () => {
					window.location.reload();
					return 'Cancelled!';
				},
				error: 'Failed to cancel',
				loading: 'Cancelling...'
			}
		);
	}

	function copyID() {
		if (!level) {
			return;
		}

		navigator.clipboard
			.writeText(level.levelID.toString())
			.then(() => toast.success('Copied to clipboard!'))
			.catch(() => toast.error('Failed to copy'));
	}

	async function getDeathCount() {
		if (!level) return;
		
		try {
			const res = await (
				await fetch(`${import.meta.env.VITE_API_URL}/level/${level.levelID}/deathCount`)
			).json();

			if (res && res.count) {
				deathCount = res.count;
			}
		} catch (error) {
			console.error('Failed to fetch death count:', error);
			deathCount = Array(100).fill(0);
		}
	}

	function genPercent() {
		const res = Array(100);
		for (let i = 0; i < 100; i++) {
			res[i] = `${i + 1}%`;
		}
		return res;
	}

	function createChart(node: any) {
		if (chart != null) {
			chart.destroy();
		}

		chart = new Chart(node, {
			type: 'bar',
			data: {
				labels: genPercent(),
				datasets: [
					{
						label: 'Death count',
						data: deathCount,
						borderWidth: 1,
						backgroundColor: 'rgba(75, 192, 192, 0.6)',
						borderColor: 'rgba(75, 192, 192, 1)'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						display: false
					},
					y: {
						display: false,
						beginAtZero: true,
						ticks: {
							precision: 0
						}
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function (context) {
								return `Deaths: ${context.parsed.y}`;
							}
						}
					},
					legend: {
						display: true
					},
					title: {
						display: false
					}
				}
			}
		});
	}

	onMount(async () => {
		if (level) {
			await getDeathCount();
		}
	});
</script>

<Card.Root class="flex flex-col p-2">
	<div class="flex flex-col gap-4 md:flex-row md:gap-6">
		<!-- Left side: Level Info -->
		<div class="flex flex-col items-center md:flex-row">
			<div class="flex w-full items-center">
				<a href={`https://www.youtube.com/watch?v=${level ? level.videoID : ''}`} target="_blank">
					<img
						src={`https://img.youtube.com/vi/${level ? level.videoID : ''}/0.jpg`}
						alt="level"
						class="h-[100px] w-[177px] rounded-xl object-cover"
					/>
				</a>
				<Card.Content class="mt-[22.5px] flex flex-col justify-center">
					<div class="flex items-center gap-[10px]">
						<div class="flex items-center gap-[5px]">
							<h2 class="text-xl font-bold">{indexToRoman(index + 1)}. {level ? level.name : '???'}</h2>
							<span
								class="inline h-fit rounded-sm bg-[var(--textColor)] pl-[5px] pr-[5px] text-[12px] font-semibold text-[var(--textColorInverted)]"
								>{level ? level.point : '???'}pt</span
							>
							{#if level && level.needRaw}
								<span
									class="inline rounded-sm bg-[var(--textColor)] pl-[5px] pr-[5px] text-[12px] font-semibold text-[var(--textColorInverted)]"
									>Raw Required</span
								>
							{/if}
						</div>
					</div>
					<div class="flex flex-col">
						by {level ? level.creator : '???'}
						<button class="flex items-center gap-[5px]" on:click={copyID}>
							ID: {level ? level.levelID : '???'}
							{#if level}
								<Copy size={15} />
							{/if}
						</button>
					</div>
				</Card.Content>
			</div>
		</div>

		{#if deathCount.length > 0}
			<div class="flex w-full min-w-0 md:ml-auto md:flex-1 lg:max-w-[300px]">
				<div class="h-[150px] w-full lg:h-[115px]">
					<canvas use:createChart />
				</div>
			</div>
		{/if}
	</div>
</Card.Root>
