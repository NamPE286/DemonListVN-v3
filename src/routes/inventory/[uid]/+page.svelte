<script lang="ts">
	import { user } from '$lib/client';
	import Loading from '$lib/components/animation/loading.svelte';
	import { onMount } from 'svelte';

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
</script>

<div class="px-[10px] xl:px-[100px] pt-[20px]">
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
				<button
					type="button"
					class={`transform rounded-md border-b-4 bg-white/5 p-0 transition-transform hover:scale-105 ${rarityClass(item.rarity)} cursor-pointer overflow-hidden text-left`}
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
			{/each}
		</div>
	{/if}
</div>

<style>
	.item-thumb {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.02));
	}
</style>
