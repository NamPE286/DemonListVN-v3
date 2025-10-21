<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { user } from '$lib/client';
	import { _ } from 'svelte-i18n';
	import * as Tabs from '$lib/components/ui/tabs';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/animation/loading.svelte';

	export let record: any;
	export let index: number;
	export let levels: any[];
	export let getPoint: (record: any, index: number) => number;
	export let onUpdate: (record: any) => void;

	let updateData: any = null;
	let levelDeathCount: number[] = [];
	let playerDeathCount: number[] = [];
	let chart: any = null;
	let isLoadingDeathCount = false;

	function handleTriggerClick() {
		updateData = structuredClone(record);
		delete updateData.eventLevels;

		updateData.accepted = {
			disabled: false,
			label: (() => {
				if (updateData.accepted === null) {
					return 'Undecided';
				}

				return updateData.accepted ? 'Accepted' : 'Rejected';
			})(),
			value: updateData.accepted
		};

		updateData.created_at = new Date(updateData.created_at).toISOString().slice(0, 16);
	}

	async function getLevelDeathCount(levelID: number) {
		const res = await (
			await fetch(`${import.meta.env.VITE_API_URL}/level/${levelID}/deathCount`)
		).json();

		return res;
	}

	async function getPlayerDeathCount(levelID: number, userID: string) {
		const res = await (
			await fetch(`${import.meta.env.VITE_API_URL}/deathCount/${userID}/${levelID}`)
		).json();

		return res;
	}

	async function loadDeathCountData() {
		if (!record || !levels[index]) return;
		
		isLoadingDeathCount = true;
		try {
			const levelID = levels[index].levelID;
			const userID = record.userID;

			const [levelData, playerData] = await Promise.all([
				getLevelDeathCount(levelID),
				getPlayerDeathCount(levelID, userID)
			]);

			levelDeathCount = levelData.count || Array(100).fill(0);
			playerDeathCount = playerData.count || Array(100).fill(0);
		} catch (error) {
			console.error('Failed to load death count data:', error);
			levelDeathCount = Array(100).fill(0);
			playerDeathCount = Array(100).fill(0);
		} finally {
			isLoadingDeathCount = false;
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
						label: 'Level Death Count',
						data: levelDeathCount,
						backgroundColor: 'rgba(75, 192, 192, 0.6)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1
					},
					{
						label: 'Player Death Count',
						data: playerDeathCount,
						backgroundColor: 'rgba(255, 99, 132, 0.6)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
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
								return `${context.dataset.label}: ${context.parsed.y}`;
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

	function handleTabChange(value: string | undefined) {
		if (value === 'deathcount' && levelDeathCount.length === 0) {
			loadDeathCountData();
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger on:click={handleTriggerClick}>
		{#if record && record.accepted === false}
			<s>
				{getPoint(record, index)}<br />
				<span class="text-[11px] opacity-50">
					{record ? `${Math.round(record.progress * 100) / 100}%` : ''}
				</span>
			</s>
		{:else if record && record.accepted === null}
			{getPoint(record, index)}*<br />
			<span class="text-[11px] opacity-50">
				{record ? `${Math.round(record.progress * 100) / 100}%` : ''}
			</span>
		{:else}
			{getPoint(record, index)}<br />
			<span class="text-[11px] opacity-50">
				{record ? `${Math.round(record.progress * 100) / 100}%` : ''}
			</span>
		{/if}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('contest.leaderboard.record_detail')}</Dialog.Title>
		</Dialog.Header>
		<Tabs.Root value="detail" class="w-[400px]" onValueChange={handleTabChange}>
			<Tabs.List>
				<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
				<Tabs.Trigger value="deathcount">Death count</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="detail">
				<div class="flex flex-col gap-0">
					<section>
						<span class="font-bold">{$_('contest.leaderboard.submitted_at')}: </span>
						{new Date(record.created_at).toLocaleString('vi-vn')}
					</section>
					<section>
						<span class="font-bold">{$_('contest.leaderboard.video_link')}: </span><a
							href={record.videoLink}
							class="text-[#95bdf7]"
							target="_blank">Link</a
						>
					</section>
					<section>
						<span class="font-bold">{$_('contest.leaderboard.raw')}: </span>
						{#if record.raw}
							<a href={record.raw} class="text-[#95bdf7]" target="_blank">Link</a>
						{:else}
							{$_('contest.leaderboard.not_provided')}
						{/if}
					</section>
					{#if record.accepted === null}
						<section class="mt-[10px] text-[13px] opacity-50">
							{$_('contest.leaderboard.unverified_notice')}
						</section>
					{:else if record.accepted === false}
						<section>
							<span class="font-bold">{$_('contest.leaderboard.reject_reason')}: </span>
							{record.rejectReason}
						</section>
						<section class="mt-[10px] text-[13px] opacity-50">
							{$_('contest.leaderboard.rejected_notice')}
						</section>
					{/if}

					{#if $user.loggedIn && $user.data.isAdmin && updateData}
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-right">{$_('contest.leaderboard.submitted_at')}</Label
								>
								<Input
									type="datetime-local"
									bind:value={updateData.created_at}
									class="col-span-3"
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-right">Progress</Label>
								<Input type="number" bind:value={updateData.progress} class="col-span-3" />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-right">{$_('contest.leaderboard.video_link')}</Label>
								<Input bind:value={updateData.videoLink} class="col-span-3" />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" placeholder="Leave blank if not rejected" class="text-right"
									>{$_('contest.leaderboard.reject_reason')}</Label
								>
								<Input bind:value={updateData.rejectReason} class="col-span-3" />
							</div>
							{#if levels[index] && levels[index].needRaw}
								<div class="grid grid-cols-4 items-center gap-4">
									<Label for="name" class="text-right">{$_('contest.leaderboard.raw')}</Label>
									<Input bind:value={updateData.raw} class="col-span-3" />
								</div>
							{/if}
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-right">Accept state</Label>
								<Select.Root bind:selected={updateData.accepted}>
									<Select.Trigger class="col-span-3">
										<Select.Value placeholder="Select a platform" />
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Item value={null}>Undecided</Select.Item>
											<Select.Item value={true}>Accepted</Select.Item>
											<Select.Item value={false}>Rejected</Select.Item>
										</Select.Group>
									</Select.Content>
									<Select.Input name="platform" value={true} />
								</Select.Root>
							</div>
							<Button on:click={() => onUpdate(updateData)}>Update</Button>
						</div>
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content value="deathcount">
				<div class="flex flex-col gap-4 py-4">
					{#if isLoadingDeathCount}
						<div class="flex h-[250px] items-center justify-center">
							<Loading />
						</div>
					{:else if levelDeathCount.length > 0 || playerDeathCount.length > 0}
						<div class="h-[200px] w-full">
							<canvas use:createChart />
						</div>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<div class="font-semibold text-[rgba(75,192,192,1)]">Level Death Count</div>
								<div class="opacity-70">Total: {levelDeathCount.reduce((a, b) => a + b, 0)}</div>
							</div>
							<div>
								<div class="font-semibold text-[rgba(255,99,132,1)]">Player Death Count</div>
								<div class="opacity-70">Total: {playerDeathCount.reduce((a, b) => a + b, 0)}</div>
							</div>
						</div>
					{:else}
						<div class="flex h-[400px] items-center justify-center opacity-50">
							No death count data available
						</div>
					{/if}
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
