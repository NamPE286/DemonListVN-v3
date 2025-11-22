<script lang="ts">
	import { user } from '$lib/client';
	import Loading from '$lib/components/animation/loading.svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	type Item = {
		userID: string;
		itemId: number;
		content: any;
		created_at: string;
		inventoryId: number;
		name: string;
		type: string | null;
		redirect: string | null;
		productId: number | null;
		description: string | null;
		rarity: number;
	};

	let items: Item[] = [];
	let loading = false;
	let error: string | null = null;

	async function fetchInventory() {
		loading = true;
		error = null;

		try {
			const res = await (
				await fetch(`${import.meta.env.VITE_API_URL}/inventory`, {
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + (await $user.token())
					}
				})
			).json();

			items = Array.isArray(res) ? res : [];
		} catch (e) {
			console.error(e);
			error = 'Failed to load inventory';
		} finally {
			loading = false;
		}
	}

	async function fetchItem(id: number) {
		const res = await (
			await fetch(`${import.meta.env.VITE_API_URL}/item/${id}`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			})
		).json();

		return res;
	}

	let selectedItems: Record<
		number,
		{
			loading: boolean;
			data: any | null;
			error: string | null;
		}
	> = {};

	async function loadItem(itemId: number, inventoryId: number) {
		selectedItems = {
			...selectedItems,
			[inventoryId]: { loading: true, data: null, error: null }
		};

		try {
			const data = await fetchItem(itemId);
			selectedItems = {
				...selectedItems,
				[inventoryId]: { loading: false, data, error: null }
			};
		} catch (e) {
			console.error(e);
			selectedItems = {
				...selectedItems,
				[inventoryId]: { loading: false, data: null, error: 'Failed to load item details' }
			};
		}
	}

	let isRolling = false;
	let hasRolled = false;
	let isFetchingResult = false;
	let rollDisplay: any[] = [];
	let rollScroll = 0;
	let rollResult: any = null;

	async function openCase(inventoryItemId: number, caseItems: any[] = []) {
		if (isRolling) {
			return;
		}

		const pollEntries =
			caseItems && caseItems.length > 0
				? caseItems.map((c: any) => ({
						item: { ...c.items, quantity: c.quantity ?? 1 },
						rate: c.rate ?? 0
					}))
				: [];
		const nothingEntry = { item: { id: 0, name: 'Nothing', type: 'none', rarity: 0 }, rate: 0 };
		const entries = [...pollEntries, nothingEntry];

		function shuffleArray<T>(arr: T[]) {
			const a = arr.slice();
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const tmp = a[i];
				a[i] = a[j];
				a[j] = tmp;
			}
			return a;
		}

		const randomizedEntries = shuffleArray(entries);
		const copies = 8;

		function pickRandom(arr: any[], n: number) {
			const out: any[] = [];
			for (let i = 0; i < n; i++) {
				out.push(arr[Math.floor(Math.random() * arr.length)]);
			}
			return out;
		}

		const itemWidth = 160;
		const gap = 8;

		rollDisplay = pickRandom(randomizedEntries, 10).map((e: any) => e.item);
		isFetchingResult = true;
		hasRolled = false;
		rollResult = null;

		let res: any = {};

		try {
			res = await (
				await fetch(`${import.meta.env.VITE_API_URL}/inventory/${inventoryItemId}/consume`, {
					method: 'DELETE',
					headers: {
						Authorization: 'Bearer ' + (await $user.token())
					}
				})
			).json();
		} catch (e) {
			console.error(e);
			res = {};
		} finally {
			isFetchingResult = false;
		}

		const resultItem = res && res.items && res.items.id ? res.items : nothingEntry.item;
		const baseSeq: any[] = [];

		baseSeq.push(...pickRandom(randomizedEntries, 30).map((e: any) => e.item));
		baseSeq.push(resultItem);
		baseSeq.push(...pickRandom(randomizedEntries, 4).map((e: any) => e.item));

		let displayEntries: any[] = [];

		for (let i = 0; i < copies; i++) {
			displayEntries.push(...baseSeq);
		}

		rollDisplay = displayEntries;

		const groupIndex = Math.floor(copies / 2);
		const startIndex = groupIndex * baseSeq.length + 4;
		const initialScrollPos = startIndex * (itemWidth + gap) + itemWidth / 2;

		rollScroll = initialScrollPos;
		isRolling = true;

		const winningIndex = 30;
		const baseIndex = groupIndex * baseSeq.length;
		const maxAdvanceGroups = copies - groupIndex - 1;
		const desiredAdvance = Math.min(
			Math.max(3, Math.floor(copies / 2)),
			Math.max(1, maxAdvanceGroups)
		);
		const winningDisplayIndex = baseIndex + desiredAdvance * baseSeq.length + winningIndex;
		const targetPosition = winningDisplayIndex * (itemWidth + gap) + itemWidth / 2;
		const randomOffset = Math.random() * (itemWidth + gap) - (itemWidth + gap) / 2;
		const minFinal = itemWidth / 2;
		const maxFinal = (rollDisplay.length - 1) * (itemWidth + gap) + itemWidth / 2;
		let finalPosition = targetPosition + randomOffset;

		if (finalPosition < minFinal) {
			finalPosition = minFinal;
		}

		if (finalPosition > maxFinal) {
			finalPosition = maxFinal;
		}

		await new Promise<void>((resolve) => {
			const startTime = Date.now();
			const duration = 7000;

			function animate() {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const easeProgress = 1 - Math.pow(1 - progress, 5);

				rollScroll = initialScrollPos + (finalPosition - initialScrollPos) * easeProgress;

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					rollScroll = finalPosition;
					resolve();
				}
			}

			requestAnimationFrame(animate);
		});

		rollResult = res;
		hasRolled = true;
		isRolling = false;
	}

	onMount(async () => {
		await fetchInventory();
	});

	async function closeAllAndReload() {
		try {
			const closeBtns = document.querySelectorAll('.absolute.right-4.top-4');
			closeBtns.forEach((b) => {
				if (b instanceof HTMLElement) b.click();
			});

			await new Promise((r) => setTimeout(r, 150));

			await fetchInventory();
		} catch (e) {
			console.error('Failed to close dialogs or reload inventory', e);
		}
	}

	const rarityClass = (r: number) => {
		switch (r) {
			case 1:
				return 'border-blue-500';
			case 2:
				return 'border-purple-500';
			case 3:
				return 'border-pink-500';
			case 4:
				return 'border-red-600';
			default:
				return 'border-gray-400';
		}
	};

	const rarityName = (r: number) => {
		switch (r) {
			case 1:
				return 'Uncommon';
			case 2:
				return 'Rare';
			case 3:
				return 'Epic';
			case 4:
				return 'Covert';
			default:
				return 'Common';
		}
	};

	const rarityColor = (r: number) => {
		switch (r) {
			case 1:
				return '#3b82f6';
			case 2:
				return '#a855f7';
			case 3:
				return '#ec4899';
			case 4:
				return '#dc2626';
			default:
				return '#9ca3af';
		}
	};
</script>

<svelte:head>
	<title>Kho đồ - Demon List VN</title>
</svelte:head>

<div class="px-[10px] pt-[20px] xl:px-[100px]">
	<h1 class="mb-4 text-2xl font-semibold">Inventory</h1>

	{#if loading}
		<div class="text-sm text-gray-500">
			<Loading inverted />
		</div>
	{:else if error}
		<div class="text-sm text-red-500">{error}</div>
	{:else if items.length === 0}
		<div class="text-sm text-gray-500">No items in inventory.</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
			{#each items as item (item.inventoryId)}
				<Dialog.Root>
					<Dialog.Trigger>
						<button
							on:click={() => loadItem(item.itemId, item.inventoryId)}
							class={`w-full transform rounded-md border-b-4 bg-white/5 p-0 transition-transform hover:scale-105 ${rarityClass(item.rarity)} cursor-pointer overflow-hidden text-left`}
							title={item.name}
							aria-label={`Open ${item.name}`}
						>
							<div class="item-thumb flex h-36 w-full items-center justify-center rounded-sm">
								<img
									src={`https://cdn.demonlistvn.com/items/${item.itemId}.webp`}
									alt={item.name}
									class="h-full w-full object-contain py-1"
								/>
							</div>
							<div class="p-2">
								<div class="truncate text-sm font-medium text-white">{item.name}</div>
							</div>
						</button>
					</Dialog.Trigger>

					<Dialog.Content>
						{#if selectedItems[item.inventoryId]?.loading}
							<div class="py-6">
								<Loading inverted />
							</div>
						{:else if selectedItems[item.inventoryId]?.error}
							<div class="py-4 text-sm text-red-400">{selectedItems[item.inventoryId].error}</div>
						{:else if selectedItems[item.inventoryId]?.data}
							<div class="flex items-start gap-4">
								<div
									class={`h-40 w-40 flex-shrink-0 overflow-hidden rounded-md border-b-4 ${rarityClass(selectedItems[item.inventoryId].data.rarity ?? item.rarity)} bg-neutral-800 p-2`}
								>
									<img
										src={`https://cdn.demonlistvn.com/items/${item.itemId}.webp`}
										alt={selectedItems[item.inventoryId].data.name ?? item.name}
										class="h-full w-full object-cover"
									/>
								</div>
								<div class="h-full flex-1">
									<div class="flex h-full flex-1 flex-col">
										<div>
											<Dialog.Header>
												<Dialog.Title
													>{selectedItems[item.inventoryId].data.name ?? item.name}</Dialog.Title
												>
												<Dialog.Description
													>{selectedItems[item.inventoryId].data.description ??
														item.description ??
														'No description available.'}</Dialog.Description
												>
											</Dialog.Header>
											<div class="mt-3 text-sm text-gray-300">
												Rarity: <span
													class="font-semibold"
													style="color: {rarityColor(
														selectedItems[item.inventoryId].data.rarity ?? item.rarity
													)}"
													>{rarityName(
														selectedItems[item.inventoryId].data.rarity ?? item.rarity
													)}</span
												>
											</div>
										</div>
										<div class="mt-auto">
											{#if selectedItems[item.inventoryId].data.type == 'case'}
												<AlertDialog.Root>
													<AlertDialog.Trigger>
														<Button
															variant="secondary"
															on:click={() =>
																openCase(
																	item.inventoryId,
																	selectedItems[item.inventoryId].data.caseItems
																)}>Open Case</Button
														>
													</AlertDialog.Trigger>
													<AlertDialog.Content>
														<div style="min-width:420px;">
															{#if isFetchingResult}
																<div class="py-6 text-center">
																	<Loading inverted />
																	<div class="mt-2 text-sm text-gray-300">
																		Waiting for server response...
																	</div>
																</div>
															{:else if isRolling}
																<div class="case-container-small">
																	<div class="case-window-small">
																		<div class="selector-line-small"></div>
																		<div
																			class="items-container-small"
																			style="transform: translateX({-rollScroll}px); transition: none;"
																		>
																			{#each rollDisplay as d}
																				<div
																					class="case-item-small"
																					style="border-color: {rarityColor(d?.rarity ?? 0)}"
																				>
																					{#if d && d.id && d.id !== 0}
																						<img
																							src={`https://cdn.demonlistvn.com/items/${d.id}.webp`}
																							alt={d.name}
																							class="case-img"
																						/>
																						<div class="case-name">{d.name} x{d.quantity}</div>
																					{:else}
																						<div class="case-empty">Nothing</div>
																					{/if}
																				</div>
																			{/each}
																		</div>
																	</div>
																</div>
															{:else if !isRolling && !hasRolled}
																<div class="p-4 text-center">Click Open Case to start rolling.</div>
															{:else}
																<div class="p-4">
																	{#if rollResult && rollResult.items}
																		<div class="result-viewport">
																			<div
																				class="result-thumb"
																				style="border-color: {rarityColor(
																					rollResult.items.rarity ?? 0
																				)}"
																			>
																				<img
																					src={`https://cdn.demonlistvn.com/items/${rollResult.items.id}.webp`}
																					alt={rollResult.items.name}
																					class="h-full w-full object-cover p-[10px]"
																				/>
																			</div>
																			<div class="mt-3 text-center">
																				<div class="text-lg font-semibold">
																					{rollResult.items.name} x{rollResult.quantity}
																				</div>
																				<div class="text-sm text-gray-300">
																					You received an item from the case
																				</div>
																			</div>
																		</div>
																	{:else}
																		<div class="text-center">
																			<div class="text-2xl font-semibold">Nothing</div>
																			<div class="text-sm text-gray-300">Better luck next time</div>
																		</div>
																	{/if}
																	<div class="h-[10px]"></div>
																	<AlertDialog.Cancel class="w-full" on:click={closeAllAndReload}
																		>Close</AlertDialog.Cancel
																	>
																</div>
															{/if}
														</div>
													</AlertDialog.Content>
												</AlertDialog.Root>
											{/if}
										</div>
									</div>
								</div>
							</div>
							{#if item.type == 'case'}
								<b class="text-center">Possible items to acquire</b>
								{#if selectedItems[item.inventoryId].data.caseItems && selectedItems[item.inventoryId].data.caseItems.length > 0}
									<div class="mt-2 grid grid-cols-3 gap-2">
										{#each selectedItems[item.inventoryId].data.caseItems as c (c.id)}
											<div
												class={`flex flex-col items-center rounded-md border-b-4 bg-neutral-900 p-2 text-center ${rarityClass(c.items.rarity ?? item.rarity)}`}
											>
												<img
													src={`https://cdn.demonlistvn.com/items/${c.items.id}.webp`}
													alt={c.items.name}
													class="mb-1 h-16 w-16 object-contain"
												/>
												<div class="text-xs font-medium">{c.items.name} x{c.quantity}</div>
												<div class="text-xs text-gray-400">
													Rate: {Math.round((c.rate ?? 0) * 100)}%
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<div
										class={`h-40 w-40 flex-shrink-0 overflow-hidden rounded-md border-b-4 ${rarityClass(item.rarity)} mt-2 bg-neutral-800 p-2`}
									>
										<img
											src={`https://cdn.demonlistvn.com/items/${item.itemId}.webp`}
											alt={item.name}
											class="h-full w-full object-cover"
										/>
									</div>
								{/if}
							{/if}
						{/if}
					</Dialog.Content>
				</Dialog.Root>
			{/each}
		</div>
	{/if}
</div>

<style>
	.item-thumb {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.02));
	}

	.case-container-small {
		position: relative;
		overflow: hidden;
		height: 180px;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
		border-radius: 8px;
		padding: 12px;
	}

	.case-window-small {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.selector-line-small {
		position: absolute;
		left: 50%;
		top: 0;
		height: 100%;
		width: 3px;
		background: rgba(255, 215, 0, 0.9);
		transform: translateX(-50%);
		z-index: 10;
		box-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
	}

	.items-container-small {
		display: flex;
		gap: 8px;
		padding-left: 50%;
		will-change: transform;
	}

	.case-item-small {
		min-width: 160px;
		width: 160px;
		height: 140px;
		background: #0b1220;
		border: 2px solid;
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8px;
		color: #fff;
	}

	.case-img {
		height: 84px;
		width: 84px;
		object-fit: contain;
	}

	.case-name {
		font-size: 12px;
		margin-top: 6px;
		text-align: center;
	}

	.case-empty {
		font-weight: 700;
		color: #9ca3af;
	}

	.result-viewport {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.result-thumb {
		width: 180px;
		height: 180px;
		overflow: hidden;
		border: 3px solid;
		border-radius: 8px;
	}
</style>
