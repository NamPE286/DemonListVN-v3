<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import Chart from 'chart.js/auto';
	import Loading from '$lib/components/animation/loading.svelte';
	import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Pencil1 } from 'svelte-radix';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { Textarea } from '$lib/components/ui/textarea';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let uid: string;
	export let levelID: number;
	export let open: boolean;

	let record: any = null;
	let chart: any = null;
	let open1 = false;
	let disableBtn = false;
	let verdict = '';
	let cmt = '';

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
		let tmp: any = {
			data: null,
			deathCount: null
		};

		tmp.data = await (
			await fetch(`${import.meta.env.VITE_API_URL}/record/${uid}/${levelID}`)
		).json();

		try {
			tmp.deathCount = await (
				await fetch(`${import.meta.env.VITE_API_URL}/deathCount/${uid}/${levelID}`)
			).json();

			tmp.deathCount = processData(tmp.deathCount.count, tmp.data.progress == 100 ? 1 : 0);
		} catch {
			tmp.deathCount = Array(100).fill(0);
		}

		//@ts-ignore
		record = tmp;
	}

	async function change() {
		disableBtn = true;
		toast.promise(
			fetch(
				`${import.meta.env.VITE_API_URL}/record/${uid}/${levelID}/changeSuggestedRating/${record.data.suggestedRating}`,
				{
					method: 'PUT',
					headers: {
						Authorization: 'Bearer ' + (await $user.token())!
					}
				}
			),
			{
				loading: 'Updating...',
				success: (data) => {
					open1 = false;
					disableBtn = false;
					return 'Updated!';
				},
				error: 'An error occured'
			}
		);
	}

	async function submitVerdict() {
		if (verdict == '') {
			toast.warning('Please select a verdict.');
			return;
		}

		const data = {
			userid: record.data.userid,
			levelid: record.data.levelid,
			needMod: verdict == 'option-two',
			isChecked: verdict == 'option-one',
			reviewerComment: cmt
		};

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/submitVerdict`, {
				method: 'PUT',
				body: JSON.stringify(data),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					open = false;
					return 'Verdict sent!';
				},
				loading: 'Sending...',
				error: 'An error occured.'
			}
		);
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

				<Tabs.Root value="detail" class="w-100">
					<Tabs.List>
						<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
						<Tabs.Trigger value="deathRate">Death rate</Tabs.Trigger>
						{#if record.data.reviewer != null && record.data.reviewer.uid == $user.data.uid && record.data.needMod == false}
							<Tabs.Trigger value="review">Review</Tabs.Trigger>
						{/if}
					</Tabs.List>
					<Tabs.Content value="detail">
						<div class="detailWrapper">
							<b>Video link:</b>
							<a href={record.data.videoLink} target="_blank"
								>{record.data.videoLink.slice(0, 25)}...</a
							><br />
							<b>Submitted on:</b>
							{new Date(record.data.timestamp).toLocaleString()}<br />
							<b>Device:</b>
							{record.data.isMobile ? 'Mobile' : 'PC'}
							{#if record.data.refreshRate}
								({record.data.refreshRate}fps)
							{/if} <br />
							<b>Progress:</b>
							{record.data.progress}% <br />
							<b>Suggested rating:</b>
							{record.data.suggestedRating ? record.data.suggestedRating : '(No rating provided)'}
							{#if record.data.progress == 100 && $user.loggedIn && $user.data.uid == record.data.players.uid}
								<Dialog.Root bind:open={open1}>
									<Dialog.Trigger>
										<Button variant="outline" size="icon" class="h-[30px]"
											><Pencil1 size={18} /></Button
										>
									</Dialog.Trigger>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Change suggested rating</Dialog.Title>
											<Input type="number" bind:value={record.data.suggestedRating} />
										</Dialog.Header>
										<Button bind:disable={disableBtn} on:click={change}>Change</Button>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
							<br />
							<b>Comment:</b>
							{record.data.comment ? record.data.comment : '(No comment provided)'}<br />
							<div class="flex gap-[5px]">
								<b>Reviewed by:</b>
								{#if record.data.reviewer != null}
									<PlayerHoverCard player={{ data: record.data.reviewer }} />
								{:else}
									Moderator
								{/if}
							</div>
							{#if $user.loggedIn && $user.data.isAdmin}
								<b>Reviewer's comment:</b>
								{record.data.reviewerComment
									? record.data.reviewerComment
									: '(No comment provided)'}<br />
							{/if}
						</div>
					</Tabs.Content>
					<Tabs.Content value="deathRate">
						<div class="chartWrapper">
							<canvas id="chart" use:createChart />
						</div>
					</Tabs.Content>
					<Tabs.Content value="review">
						<RadioGroup.Root bind:value={verdict}>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="option-one" id="option-one" />
								<Label for="option-one">This record is legitimate.</Label>
							</div>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="option-two" id="option-two" />
								<Label for="option-two"
									>Need further inspection (This record will be forwarded to a moderator).</Label
								>
							</div>
							<Textarea bind:value={cmt} placeholder="Additional comment (optional)" />
							<Button on:click={submitVerdict}>Submit verdict</Button>
						</RadioGroup.Root>
					</Tabs.Content>
				</Tabs.Root>
			{:else}
				<Loading inverted />
			{/if}
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.detailWrapper {
		width: 100%;
		word-wrap: break-word;
	}
	a {
		text-decoration: underline;
		color: #99c3ff;
	}

	.chartWrapper {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 200px;
	}
</style>
