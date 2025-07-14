<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { onMount } from 'svelte';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import type { Level } from './type';
	import Button from '$lib/components/ui/button/button.svelte';
	import { user } from '$lib/client';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { toast } from 'svelte-sonner';
	import { Reload } from 'svelte-radix';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { ExclamationTriangle } from 'svelte-radix';

	export let levels: (Level | null)[];
	export let event: any;

	let leaderboard: any[] = [];
	let refreshing = false;
	let updateData: any = null;

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

	function getPenalty(records: any[], divide: number) {
		let res: number = 0;

		for (const i of records) {
			if (i == null || i.accepted === false) {
				continue;
			}

			res += new Date(i.created_at).getTime() - new Date(event.start).getTime();
		}

		return Math.round(res / divide);
	}

	function getPenaltyTooltip(records: any[]) {
		const ms = getPenalty(records, 1);

		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const milliseconds = ms % 1000;

		return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''} ${milliseconds} millisecond${milliseconds !== 1 ? 's' : ''}`;
	}

	function getPoint(record: any, index: number, checkAcp = false) {
		if (record === null || (record.accepted === false && checkAcp)) {
			return 0;
		}

		if (!levels[index]) {
			return 0;
		}

		const res = (record.progress / 100) * levels[index].point;

		return Math.round(res * 100) / 100;
	}

	function getTotalPoint(records: any[]) {
		let res = 0;

		for (let i = 0; i < records.length; i++) {
			res += getPoint(records[i], i, true);
		}

		return Math.round(res * 100) / 100;
	}

	async function refresh(noti = false) {
		const upd = async () => {
			refreshing = true;
			leaderboard = await (
				await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/leaderboard`, {
					method: 'GET',
					headers: {
						Authorization: $user.loggedIn ? 'Bearer ' + (await $user.token()) : ''
					}
				})
			).json();
			refreshing = false;
		};

		if (noti) {
			toast.promise(upd, {
				success: 'Refreshed!',
				error: 'Failed to refresh',
				loading: 'Refreshing...'
			});
		} else {
			await upd();
		}
	}

	async function updateRecord(record: any) {
		updateData.accepted = updateData.accepted.value;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/submission`, {
				method: 'PATCH',
				body: JSON.stringify(updateData),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: 'Updated!',
				error: 'Failed to update',
				loading: 'Updating...'
			}
		);

		record = updateData;
	}

	onMount(async () => {
		await refresh();
	});
</script>

{#if event.freeze}
	<Alert.Root class="mb-[10px] ml-auto mr-auto w-[1500px] max-w-full text-yellow-400">
		<Alert.Title class="flex items-center gap-[10px]">
			<ExclamationTriangle size={15} />
			{#if new Date(event.freeze) > new Date()}
				The leaderboard will be freezed on {new Date(event.freeze).toLocaleString('vi-vn')}.
			{:else}
				The leaderboard is freezed since {new Date(event.freeze).toLocaleString('vi-vn')}.
			{/if}
		</Alert.Title>
	</Alert.Root>
{/if}
<div class="mb-[10px] flex justify-center gap-[10px]">
	<a href="#me">
		<Button class="w-[200px]" variant="outline">Jump to me</Button>
	</a>
	<Button class="w-fit" variant="outline" disabled={refreshing} on:click={() => refresh(true)}>
		<Reload size={16} />
	</Button>
</div>
<Table.Root class="ml-auto mr-auto w-[1500px] max-w-full">
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Rank</Table.Head>
			<Table.Head class="min-w-[200px]">Player</Table.Head>
			<Table.Head class="w-[75px] text-center">Total</Table.Head>
			<Table.Head class="w-[75px] text-center">Penalty</Table.Head>
			{#each levels as level, index}
				<Table.Head class="w-[75px] text-center">
					<Tooltip.Root>
						<Tooltip.Trigger>
							{indexToRoman(index + 1)}
						</Tooltip.Trigger>
						<Tooltip.Content>{level ? level.name : '???'}</Tooltip.Content>
					</Tooltip.Root>
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each leaderboard as player, rank}
			<Table.Row>
				{#if $user.loggedIn && player.uid == $user.data.uid}
					<Table.Cell class="font-medium text-yellow-500">#{rank + 1}</Table.Cell>
				{:else}
					<Table.Cell class="font-medium">#{rank + 1}</Table.Cell>
				{/if}
				<Table.Cell class="min-w-[200px]">
					{#if $user.loggedIn && player.uid == $user.data.uid}
						<div id="me">
							<PlayerHoverCard {player} showTitle={true} />
						</div>
					{:else}
						<PlayerHoverCard {player} showTitle={true} />
					{/if}
				</Table.Cell>
				<Table.Cell class="w-[75px] text-center font-bold">
					{getTotalPoint(player.eventRecords)}
				</Table.Cell>
				<Table.Cell class="w-[75px] text-center">
					<Tooltip.Root>
						<Tooltip.Trigger>
							{getPenalty(player.eventRecords, 60000)}
						</Tooltip.Trigger>
						<Tooltip.Content>{getPenaltyTooltip(player.eventRecords)}</Tooltip.Content>
					</Tooltip.Root>
				</Table.Cell>
				{#each player.eventRecords as record, index}
					<Table.Cell class="w-[75px] text-center">
						{#if getPoint(record, index) == 0}
							0
						{:else}
							<Dialog.Root>
								<Dialog.Trigger
									on:click={() => {
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

										updateData.created_at = new Date(updateData.created_at)
											.toISOString()
											.slice(0, 16);
									}}
								>
									{#if record && record.accepted === false}
										<s>
											{getPoint(record, index)}<br />
											<span class="text-[11px] opacity-50">
												{record ? `${record.progress}%` : ''}
											</span>
										</s>
									{:else if record && record.accepted === null}
										{getPoint(record, index)}*<br />
										<span class="text-[11px] opacity-50">
											{record ? `${record.progress}%` : ''}
										</span>
									{:else}
										{getPoint(record, index)}<br />
										<span class="text-[11px] opacity-50">
											{record ? `${record.progress}%` : ''}
										</span>
									{/if}
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Record's Detail</Dialog.Title>
									</Dialog.Header>
									<div class="flex flex-col gap-0">
										<section>
											<span class="font-bold">Submitted at: </span>
											{new Date(record.created_at).toLocaleString('vi-vn')}
										</section>
										<section>
											<span class="font-bold">Video's Link: </span><a
												href={record.videoLink}
												class="text-[#95bdf7]"
												target="_blank">Link</a
											>
										</section>
										<section>
											<span class="font-bold">Raw: </span>
											{#if record.raw}
												<a href={record.raw} class="text-[#95bdf7]" target="_blank">Link</a>
											{:else}
												(Not provided)
											{/if}
										</section>
										{#if record.accepted === null}
											<section class="mt-[10px] text-[13px] opacity-50">
												* This record legitimacy is not verified
											</section>
										{:else if record.accepted === false}
											<section class="mt-[10px] text-[13px] opacity-50">
												* This record is not counted
											</section>
										{/if}

										{#if $user.loggedIn && $user.data.isAdmin && updateData}
											<div class="grid gap-4 py-4">
												<div class="grid grid-cols-4 items-center gap-4">
													<Label for="name" class="text-right">Submitted at</Label>
													<Input
														type="datetime-local"
														bind:value={updateData.created_at}
														class="col-span-3"
													/>
												</div>
												<div class="grid grid-cols-4 items-center gap-4">
													<Label for="name" class="text-right">Progress</Label>
													<Input
														type="number"
														bind:value={updateData.progress}
														class="col-span-3"
													/>
												</div>
												<div class="grid grid-cols-4 items-center gap-4">
													<Label for="name" class="text-right">Video's Link</Label>
													<Input bind:value={updateData.videoLink} class="col-span-3" />
												</div>
												{#if levels[index] && levels[index].needRaw}
													<div class="grid grid-cols-4 items-center gap-4">
														<Label for="name" class="text-right">Raw</Label>
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
												<Button on:click={() => updateRecord(record)}>Update</Button>
											</div>
										{/if}
									</div>
								</Dialog.Content>
							</Dialog.Root>
						{/if}
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
