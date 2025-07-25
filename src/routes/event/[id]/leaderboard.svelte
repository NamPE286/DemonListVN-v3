<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Download from 'svelte-radix/Download.svelte';
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
	import { flip } from 'svelte/animate';
	import { cn } from '$lib/utils.js';

	export let levels: (Level | null)[];
	export let event: any;

	let leaderboard: any[] = [];
	let leaderboard1: any[] = [];
	let refreshing = false;
	let updateData: any = null;
	let revealMode = false;

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
			if (i == null || i == 'revealed' || i.accepted === false) {
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
		if (record === null || record == 'revealed' || (record.accepted === false && checkAcp)) {
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

			if ($user.loggedIn && $user.data.isAdmin) {
				leaderboard1 = await (
					await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/leaderboard`)
				).json();
			}

			refreshing = false;
			revealMode = false;
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

	function exportToCSV() {
		function escapeCSV(str: any) {
			if (str === null || str === undefined) return '';
			str = String(str);
			if (str.includes('"') || str.includes(',') || str.includes('\n')) {
				return '"' + str.replace(/"/g, '""') + '"';
			}
			return str;
		}

		let csvContent = 'Rank,Player,UserID,Total,Penalty';

		for (let i = 0; i < levels.length; i++) {
			const levelName = levels[i] ? escapeCSV(levels[i]!.name) : '???';
			csvContent += `,${levelName}`;
		}
		csvContent += '\n';

		leaderboard.forEach((player, rank) => {
			const playerName = escapeCSV(
				(player.clan ? `[${player.clans.tag}] ` : '') + player.name || 'Unknown'
			);
			const userID = escapeCSV(player.uid || 'Unknown');

			csvContent += `${rank + 1},${playerName},${userID},${getTotalPoint(player.eventRecords)},${getPenalty(player.eventRecords, 60000)}`;

			player.eventRecords.forEach((record: any, index: any) => {
				const point = getPoint(record, index, true);
				csvContent += `,${point}`;
			});

			csvContent += '\n';
		});

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `event_${event.id}_leaderboard.csv`);

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function reveal(uid: string, levelIndex: number, rank: number) {
		let res;

		for (const i of leaderboard1) {
			if (i.uid == uid) {
				res = i;
				break;
			}
		}

		if (!res.eventRecords[levelIndex]) {
			leaderboard[rank].eventRecords[levelIndex] = 'revealed';
		} else {
			leaderboard[rank].eventRecords[levelIndex] = res.eventRecords[levelIndex];
		}

		leaderboard.sort((a, b) => {
			const x = a.eventRecords.reduce((sum: any, record: any, index: any) => {
				return (
					sum +
					(record && (record.accepted === null || record.accepted === true)
						? levels[index]!.point * record.progress
						: 0)
				);
			}, 0);

			const y = b.eventRecords.reduce((sum: any, record: any, index: any) => {
				return (
					sum +
					(record && (record.accepted === null || record.accepted === true)
						? levels[index]!.point * record.progress
						: 0)
				);
			}, 0);

			if (x == y && x != 0) {
				return getPenalty(a.eventRecords, 1) - getPenalty(b.eventRecords, 1);
			}

			return y - x;
		});
	}

	onMount(async () => {
		await refresh();
	});
</script>

{#if event.freeze}
	<Alert.Root class="sticky top-0 mb-[10px] ml-auto mr-auto w-[1500px] max-w-full text-yellow-400">
		<Alert.Title class="flex items-center gap-[10px]">
			<ExclamationTriangle size={15} />
			{#if new Date(event.freeze) > new Date()}
				The leaderboard will be freezed on {new Date(event.freeze).toLocaleString('vi-vn')}.
			{:else if event.freeze == event.start}
				The leaderboard is hidden.
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
	<Button
		on:click={exportToCSV}
		disabled={leaderboard.length === 0}
		class="w-fit"
		variant="outline"
	>
		<Download size={16} />
	</Button>
	<Button class="w-fit" variant="outline" disabled={refreshing} on:click={() => refresh(true)}>
		<Reload size={16} />
	</Button>
	{#if $user.loggedIn && $user.data.isAdmin}
		<Button
			on:click={() => {
				revealMode = !revealMode;
				[leaderboard, leaderboard1] = [leaderboard1, leaderboard];
			}}
			disabled={leaderboard.length === 0}
			class="w-fit"
			variant="outline"
		>
			Switch to {revealMode ? 'Normal' : 'Reveal'} Mode
		</Button>
	{/if}
</div>
<div class="sticky top-[55px] z-10 bg-[hsl(var(--background))]">
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
	</Table.Root>
</div>

<div class="select-none overflow-y-hidden">
	<Table.Root class="ml-auto mr-auto w-[1500px] max-w-full">
		<Table.Body>
			{#each leaderboard as player, rank (player.uid)}
				<tr
					animate:flip={{}}
					class={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted')}
				>
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
						{#if !revealMode}
							<Table.Cell class="w-[75px] text-center">
								{#if getPoint(record, index) == 0}
									{#if new Date(event.freeze) > new Date()}
										0
									{:else}
										-
									{/if}
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
													<section>
														<span class="font-bold">Reject Reason: </span>
														{record.rejectReason}
													</section>
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
														<div class="grid grid-cols-4 items-center gap-4">
															<Label
																for="name"
																placeholder="Leave blank if not rejected"
																class="text-right">Reject Reason</Label
															>
															<Input bind:value={updateData.rejectReason} class="col-span-3" />
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
						{:else}
							<Table.Cell
								class="h-[50px] w-[75px] cursor-pointer text-center"
								on:click={() => reveal(player.uid, index, rank)}
							>
								{#if getPoint(record, index)}
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
								{:else if record == 'revealed'}
									0
								{:else}
									-
								{/if}
							</Table.Cell>
						{/if}
					{/each}
				</tr>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
