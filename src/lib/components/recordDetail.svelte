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
	import { page } from '$app/stores';
	import { _, locale } from 'svelte-i18n';

	export let uid: string;
	export let levelID: number;
	export let open: boolean;

	let record: any = null;
	let chart: any = null;
	let open1 = false;
	let disableBtn = false;
	let verdict = '';
	let cmt = '';

	function getTimeString(ms: number) {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const milliseconds = ms % 1000;

		return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
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
						label: 'Death count',
						data: record.deathCount.count,
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
								return String(context.parsed.y);
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

	async function applyEdit() {
		const data = structuredClone(record.data);
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
			fetch(`${import.meta.env.VITE_API_URL}/record/${record.data.userid}/${record.data.levelid}`, {
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

	function getShareLink() {
		return `${$page.url.origin}/level/${record.data.levelid}?record=${record.data.userid}`;
	}

	$: (open, fetchData());
</script>

<Dialog.Root
	{open}
	onOpenChange={() => {
		open = false;
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('record_detail.title')}</Dialog.Title>
			{#if record}
				<DialogDescription>
					{#if $locale == 'vi'}
						Bản ghi {record.data.levels.name} của {record.data.players.name}
					{:else}
						{record.data.players.name}'s {record.data.levels.name} record
					{/if}
				</DialogDescription>

				<Tabs.Root value="detail" class="w-100">
					<Tabs.List>
						<Tabs.Trigger value="detail">{$_('record_detail.tabs.detail')}</Tabs.Trigger>
						<Tabs.Trigger value="deathCount">{$_('record_detail.tabs.death_count')}</Tabs.Trigger>
						<Tabs.Trigger value="share">{$_('record_detail.tabs.share')}</Tabs.Trigger>
						{#if record.data.reviewer != null && $user.loggedIn && record.data.reviewer.uid == $user.data.uid && record.data.needMod == false}
							<Tabs.Trigger value="review">{$_('record_detail.tabs.review')}</Tabs.Trigger>
						{/if}
						{#if $user.loggedIn && $user.data.isAdmin}
							<Tabs.Trigger value="edit">{$_('record_detail.tabs.edit')}</Tabs.Trigger>
						{/if}
					</Tabs.List>
					<Tabs.Content value="detail">
						<div class="detailWrapper">
							<b>{$_('record_detail.title')}:</b>
							<a href={record.data.videoLink} target="_blank"
								>{record.data.videoLink.slice(0, 25)}...</a
							><br />
							{#if $user.loggedIn && ($user.data.isAdmin || $user.data.isTrusted)}
								<b>Raw:</b>
								<a href={record.data.raw} target="_blank">{record.data.raw.slice(0, 25)}...</a><br
								/>
							{/if}
							<b>{$_('record_detail.submit')}:</b>
							{new Date(record.data.timestamp).toLocaleString('vi-VN')}<br />
							<b>{$_('record_detail.device')}:</b>
							{record.data.mobile ? 'Mobile' : 'PC'}
							{#if record.data.refreshRate}
								({record.data.refreshRate}fps)
							{/if} <br />
							{#if !record.data.levels.isPlatformer}
								<b>{$_('record_detail.progress')}:</b>
								{record.data.progress}% <br />
							{:else}
								<b>{$_('record_detail.time')}:</b>
								{getTimeString(record.data.progress)} <br />
							{/if}
							<b>{$_('record_detail.rating')}:</b>
							{record.data.suggestedRating ? record.data.suggestedRating : 'N/a'}
							{#if record.data.progress == 100 && $user.loggedIn && $user.data.uid == record.data.players.uid}
								<Dialog.Root bind:open={open1}>
									<Dialog.Trigger>
										<Button variant="outline" size="icon" class="h-[30px]"
											><Pencil1 size={18} /></Button
										>
									</Dialog.Trigger>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>{$_('record_detail.rating_change')}</Dialog.Title>
											<Input
												type="number"
												inputmode="numeric"
												bind:value={record.data.suggestedRating}
											/>
										</Dialog.Header>
										<Button bind:disable={disableBtn} on:click={change}>Change</Button>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
							<br />
							<b>{$_('record_detail.comment')}:</b>
							{record.data.comment ? record.data.comment : '(No comment provided)'}<br />
							<div class="flex gap-[5px]">
								<b>{$_('record_detail.reviewed_by')}:</b>
								{#if record.data.reviewer != null}
									<PlayerHoverCard player={record.data.reviewer} />
								{:else}
									Moderator
								{/if}
							</div>
							{#if $user.loggedIn && $user.data.isAdmin}
								<b>{$_('record_detail.reviewer_cmt')}:</b>
								{record.data.reviewerComment
									? record.data.reviewerComment
									: 'N/a'}<br />
							{/if}
						</div>
					</Tabs.Content>
					<Tabs.Content value="deathCount">
						<div class="chartWrapper">
							<canvas id="chart" use:createChart />
						</div>
					</Tabs.Content>
					<Tabs.Content value="share">
						<div class="flex gap-[10px]">
							<Input value={getShareLink()} readonly />
							<Button
								on:click={async () => {
									await navigator.clipboard.writeText(getShareLink());
									toast.success('Copied to clipboard!');
								}}>Copy</Button
							>
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
								<Input id="videoLink" bind:value={record.data.videoLink} />
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="raw" class="w-[100px]">Raw</Label>
								<Input id="raw" bind:value={record.data.raw} />
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="refreshRate" class="w-[100px]">Refresh rate</Label>
								<Input
									id="refreshRate"
									type="number"
									inputmode="numeric"
									bind:value={record.data.refreshRate}
								/>
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="progress" class="w-[100px]">Progress</Label>
								<Input
									id="progress"
									type="number"
									inputmode="numeric"
									bind:value={record.data.progress}
								/>
							</div>
							<div class="flex items-center gap-[10px]">
								<Label for="mobile" class="w-[80px]">Mobile</Label>
								<Switch id="mobile" bind:checked={record.data.mobile} />
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
