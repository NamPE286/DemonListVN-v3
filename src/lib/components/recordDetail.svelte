<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import Chart from 'chart.js/auto';
	import Loading from '$lib/components/animation/loading.svelte';
	import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';

	export let uid: string;
	export let levelID: number;
	export let open: boolean;

	let record: any = null;
	let chart: any = null;

	function processData(arr: any[], initValue: number) {
		let cnt = initValue;

		for (let i = 99; i >= 0; i--) {
			cnt += arr[i];
			arr[i] = (arr[i] / cnt) * 100;
			arr[i] = Math.floor(arr[i] * 100) / 100;
		}

		return arr;
	}

	function genPercent() {
		const res = Array(100);

		for (let i = 0; i < 100; i++) {
			res[i] = `${i}%`;
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
						label: 'Death rate',
						data: record.deathCount,
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function (context) {
								var label = context.dataset.label || '';
								if (context.parsed.y !== null) {
									label += ' ' + context.parsed.y + '%';
								}
								return label;
							}
						}
					}
				}
			}
		});
	}

	async function fetchData() {
		if (!open) {
			return;
		}

		record = null;
		let tmp = {
			data: null,
			deathCount: null
		};

		tmp.data = await (
			await fetch(`${import.meta.env.VITE_API_URL}/record/${uid}/${levelID}`)
		).json();

		tmp.deathCount = await (
			await fetch(`${import.meta.env.VITE_API_URL}/deathCount/${uid}/${levelID}`)
		).json();

		//@ts-ignore
		tmp.deathCount = processData(tmp.deathCount.count, tmp.data.progress == 100 ? 1 : 0);
		record = tmp;

		console.log(record);
	}

	$: open, fetchData();
</script>

<Dialog.Root
	{open}
	onOpenChange={() => {
		open = false;
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Record's detail</Dialog.Title>
			{#if record}
				<DialogDescription
					>{record.data.players.name}'s {record.data.levels.name} record</DialogDescription
				>

				<Tabs.Root value="detail" class="w-[400px]">
					<Tabs.List>
						<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
						<Tabs.Trigger value="deathRate">Death rate</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="detail">
						<b>Video link:</b>
						<a href={record.data.videoLink} target="_blank"
							>{record.data.videoLink.slice(0, 25)}...</a
						><br />
						<b>Submitted on:</b>
						{new Date(record.data.timestamp).toLocaleString()}<br />
						<b>Device:</b>
						{record.data.isMobile ? 'Mobile' : 'PC'} ({record.data.refreshRate}fps) <br />
						<b>Progress:</b>
						{record.data.progress}% <br />
						<b>Suggested rating:</b>
						{record.data.suggestedRating ? record.data.suggestedRating : '(No rating provided)'}<br
						/>
						<b>Comment:</b>
						{record.data.comment ? record.data.comment : '(No comment provided)'}
					</Tabs.Content>
					<Tabs.Content value="deathRate">
						<div class="chartWrapper">
							<canvas id="chart" use:createChart />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{:else}
				<Loading inverted />
			{/if}
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	a {
		text-decoration: underline;
		color: #99c3ff;
	}

	.chartWrapper {
		display: flex;
		justify-content: center;
		width: calc(100% + 20px);
		height: 200px;
	}
</style>
