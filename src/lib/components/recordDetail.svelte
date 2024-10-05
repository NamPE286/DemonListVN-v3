<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import Chart from 'chart.js/auto';
	import Loading from '$lib/components/animation/loading.svelte';
	import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import { Pencil1 } from 'svelte-radix';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import { Button } from '$lib/components/ui/button';

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
				`${import.meta.env.VITE_API_URL}/record/${uid}/${levelID}/changeSuggestedRating/${record.suggestedRating}`,
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
			userid: record.userid,
			levelid: record.levelid,
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

	async function applyEdit() {
		const data = structuredClone(record);
		delete data.levels;
		delete data.players;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/record`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + (await $user.token())!
				},
				body: JSON.stringify(data)
			}),
			{
				success: () => {
					open = false;
					window.location.reload();
					return 'Changed applied. This page will be refreshed';
				},
				loading: 'Applying changes...',
				error: 'An error occured'
			}
		);
	}

	async function deleteRecord() {
		if (!confirm('Delete this record?')) {
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/record/${record.userid}/${record.levelid}`, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())!
				}
			}),
			{
				success: () => {
					open = false;
					window.location.reload();
					return 'Deleted. This page will be refreshed';
				},
				loading: 'Deleting...',
				error: 'An error occured'
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
				<DialogDescription>{record.players.name}'s {record.levels.name} record</DialogDescription>

				<Tabs.Root value="detail" class="w-100">
					<Tabs.List>
						<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
						<Tabs.Trigger value="deathRate">Death rate</Tabs.Trigger>
						{#if record.reviewer != null && $user.loggedIn && record.reviewer.uid == $user.data.uid && record.needMod == false}
							<Tabs.Trigger value="review">Review</Tabs.Trigger>
						{/if}
						{#if $user.loggedIn && $user.data.isAdmin}
							<Tabs.Trigger value="edit">Edit</Tabs.Trigger>
						{/if}
					</Tabs.List>
					<Tabs.Content value="detail">
						<div class="detailWrapper">
							<b>Video link:</b>
							<a href={record.videoLink} target="_blank">{record.videoLink.slice(0, 25)}...</a><br
							/>
							{#if $user.loggedIn && ($user.data.isAdmin || $user.data.isTrusted)}
								<b>Raw:</b>
								<a href={record.raw} target="_blank">{record.raw.slice(0, 25)}...</a><br />
							{/if}
							<b>Submitted on:</b>
							{new Date(record.timestamp).toLocaleString()}<br />
							<b>Device:</b>
							{record.mobile ? 'Mobile' : 'PC'}
							{#if record.refreshRate}
								({record.refreshRate}fps)
							{/if} <br />
							<b>Progress:</b>
							{record.progress}% <br />
							<b>Suggested rating:</b>
							{record.suggestedRating ? record.suggestedRating : '(No rating provided)'}
							{#if record.progress == 100 && $user.loggedIn && $user.data.uid == record.players.uid}
								<Dialog.Root bind:open={open1}>
									<Dialog.Trigger>
										<Button variant="outline" size="icon" class="h-[30px]"
											><Pencil1 size={18} /></Button
										>
									</Dialog.Trigger>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Change suggested rating</Dialog.Title>
											<Input type="number" bind:value={record.suggestedRating} />
										</Dialog.Header>
										<Button bind:disable={disableBtn} on:click={change}>Change</Button>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
							<br />
							<b>Comment:</b>
							{record.comment ? record.comment : '(No comment provided)'}<br />
							<div class="flex gap-[5px]">
								<b>Reviewed by:</b>
								{#if record.reviewer != null}
									<PlayerHoverCard player={record.reviewer} />
								{:else}
									Moderator
								{/if}
							</div>
							{#if $user.loggedIn && $user.data.isAdmin}
								<b>Reviewer's comment:</b>
								{record.reviewerComment ? record.reviewerComment : '(No comment provided)'}<br />
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
					<Tabs.Content value="edit">
						<div class="flex flex-col gap-[10px]">
							<div class="flex items-center gap-[10px]">
								<Label for="videoLink" class="w-[100px]">Video's Link</Label>
								<Input id="videoLink" bind:value={record.videoLink} />
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="raw" class="w-[100px]">Raw</Label>
								<Input id="raw" bind:value={record.raw} />
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="refreshRate" class="w-[100px]">Refresh rate</Label>
								<Input id="refreshRate" type="number" bind:value={record.refreshRate} />
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="progress" class="w-[100px]">Progress</Label>
								<Input id="progress" type="number" bind:value={record.progress} />
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="mobile" class="w-[80px]">Mobile</Label>
								<Switch id="mobile" bind:checked={record.mobile} />
							</div>
							<Button class="mt-[10px]" on:click={applyEdit}>Apply</Button>
							<Button class="mt-[10px]" variant="destructive" on:click={deleteRecord}>Delete</Button
							>
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
