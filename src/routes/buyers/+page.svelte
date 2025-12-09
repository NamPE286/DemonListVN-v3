<script lang="ts">
	import { _ } from 'svelte-i18n';
	import BuyerCard from './buyerCard.svelte';
	import BigTitle from '$lib/components/bigTitle.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import PlayerLink from '$lib/components/playerLink.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { goto } from '$app/navigation';

	export let data: any;

	function handleIntervalChange(value: string) {
		goto(`/buyers?interval=${value}`);
	}

	function formatTotalAmount(buyers: any[]): string {
		const total = buyers.reduce((sum, buyer) => sum + buyer.totalAmount, 0);
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(total);
	}

	$: totalRevenue = formatTotalAmount(data.buyers);
	$: topBuyer = data.buyers[0];
	$: averageSpending = data.buyers.length > 0 
		? new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(data.buyers.reduce((sum: number, b: any) => sum + b.totalAmount, 0) / data.buyers.length)
		: '0 ₫';
</script>

<svelte:head>
	<title>Top Supporter - Demon List VN</title>
</svelte:head>

<div class="container mx-auto max-w-6xl px-4 py-8">
	<BigTitle value="Top Supporter" />

	<Tabs.Root value={data.interval} class="mb-6">
		<Tabs.List class="grid w-full grid-cols-3">
			<Tabs.Trigger value="30" on:click={() => handleIntervalChange('30')}>Last 30 Days</Tabs.Trigger>
			<Tabs.Trigger value="14" on:click={() => handleIntervalChange('14')}>Last 14 Days</Tabs.Trigger>
			<Tabs.Trigger value="7" on:click={() => handleIntervalChange('7')}>Last 7 Days</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<div class="mb-8 grid gap-4 md:grid-cols-3">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-green-600">{totalRevenue}</div>
				<p class="text-xs text-muted-foreground">From all supporters</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Top Supporter</CardTitle>
			</CardHeader>
			<CardContent>
				{#if topBuyer}
					<div class="mb-1">
						<PlayerLink player={topBuyer.player} />
					</div>
					<p class="text-xs text-muted-foreground">
						{new Intl.NumberFormat('vi-VN', {
							style: 'currency',
							currency: 'VND'
						}).format(topBuyer.totalAmount)}
					</p>
				{:else}
					<div class="text-2xl font-bold">N/A</div>
					<p class="text-xs text-muted-foreground">0 ₫</p>
				{/if}
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Average Spending</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{averageSpending}</div>
				<p class="text-xs text-muted-foreground">{data.buyers.length} supporters</p>
			</CardContent>
		</Card>
	</div>

	<div class="space-y-4">
		{#if data.buyers && data.buyers.length > 0}
			<div class="grid gap-3 md:grid-cols-2">
				{#each data.buyers as buyer, index}
					<BuyerCard {buyer} rank={index + 1} />
				{/each}
			</div>
		{:else}
			<Card>
				<CardContent class="py-8 text-center">
					<p class="text-muted-foreground">No buyers found</p>
				</CardContent>
			</Card>
		{/if}
	</div>
</div>

<style>
	:global(.container) {
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
