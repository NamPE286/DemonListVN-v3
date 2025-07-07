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

	export let levels: Level[];
	export let event: any;

	let leaderboard: any[] = [];
	let refreshing = false;

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
			if (i == null) {
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

	function getPoint(record: any, index: number) {
		if (record === null) {
			return 0;
		}

		const res = (record.progress / 100) * levels[index].point;

		return Math.round(res * 100) / 100;
	}

	function getTotalPoint(records: any[]) {
		let res = 0;

		for (let i = 0; i < records.length; i++) {
			res += getPoint(records[i], i);
		}

		return Math.round(res * 100) / 100;
	}

	async function update(noti = false) {
		const upd = async () => {
			refreshing = true;
			leaderboard = await (
				await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/leaderboard`)
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

	onMount(async () => {
		await update();
	});
</script>

<div class="mb-[10px] flex justify-center gap-[10px]">
	<a href="#me">
		<Button class="w-[200px]" variant="outline">Jump to me</Button>
	</a>
	<Button class="w-[100px]" variant="outline" disabled={refreshing} on:click={() => update(true)}
		>Refresh</Button
	>
</div>
<Table.Root class="ml-auto mr-auto w-[1500px] max-w-full">
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Rank</Table.Head>
			<Table.Head class="min-w-[200px]">Player</Table.Head>
			<Table.Head class="w-[75px] text-center">Penalty</Table.Head>
			<Table.Head class="w-[75px] text-center">Total</Table.Head>
			{#each levels as level, index}
				<Table.Head class="w-[75px] text-center">
					<Tooltip.Root>
						<Tooltip.Trigger>
							{indexToRoman(index + 1)}
						</Tooltip.Trigger>
						<Tooltip.Content>{level.name}</Tooltip.Content>
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
							<PlayerHoverCard {player} />
						</div>
					{:else}
						<PlayerHoverCard {player} />
					{/if}
				</Table.Cell>
				<Table.Cell class="w-[75px] text-center">
					<Tooltip.Root>
						<Tooltip.Trigger>
							{getPenalty(player.eventRecords, 60000)}
						</Tooltip.Trigger>
						<Tooltip.Content>{getPenaltyTooltip(player.eventRecords)}</Tooltip.Content>
					</Tooltip.Root>
				</Table.Cell>
				<Table.Cell class="w-[75px] text-center font-bold">
					{getTotalPoint(player.eventRecords)}
				</Table.Cell>
				{#each player.eventRecords as record, index}
					<Table.Cell class="w-[75px] text-center">
						{#if getPoint(record, index) == 0}
							0
						{:else}
							<Dialog.Root>
								<Dialog.Trigger>
									{getPoint(record, index)}<br />
									<span class="text-[11px] opacity-50">
										{record ? `${record.progress}%` : ''}
									</span>
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
												target="_blank">{record.videoLink}</a
											>
										</section>
										<section>
											<span class="font-bold">Raw: </span><a
												href={record.raw}
												class="text-[#95bdf7]"
												target="_blank">{record.raw ? record.raw : '(Not provided)'}</a
											>
										</section>
										{#if !record.accepted}
											<section class="mt-[10px] text-[13px] opacity-50">
												* This record legitimacy is not verified
											</section>
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
