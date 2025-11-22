<script lang="ts">
	import { user } from '$lib/client';
	import Loading from '$lib/components/animation/loading.svelte';
	import { onMount } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

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

	async function fetchData() {
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

	onMount(async () => {
		await fetchData();
	});

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
						<div class="flex items-start gap-4">
							<div
								class={`h-40 w-40 flex-shrink-0 overflow-hidden rounded-md border-b-4 ${rarityClass(
									item.rarity
								)} bg-neutral-800 p-2`}
							>
								<img
									src={`https://cdn.demonlistvn.com/items/${item.itemId}.webp`}
									alt={item.name}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="h-full flex-1">
								<div class="flex h-full flex-1 flex-col">
									<div>
										<Dialog.Header>
											<Dialog.Title>{item.name}</Dialog.Title>
											<Dialog.Description
												>{item.description ?? 'No description available.'}</Dialog.Description
											>
										</Dialog.Header>
										<div class="mt-3 text-sm text-gray-300">
											Rarity: <span class="font-semibold" style="color: {rarityColor(item.rarity)}"
												>{rarityName(item.rarity)}</span
											>
										</div>
									</div>
									<div class="mt-auto">
										{#if item.type == 'case'}
											<Button variant="secondary">Open Case</Button>
										{/if}
									</div>
								</div>
							</div>
						</div>
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
</style>
