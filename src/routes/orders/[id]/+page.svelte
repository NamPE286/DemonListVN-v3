<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/Title.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;

	function cancellable() {
		for (const i of data.orderTracking) {
			if (i.delivering) {
				return false;
			}
		}

		return true;
	}
</script>

<svelte:head>
	<title>Order Details - Demon List VN</title>
</svelte:head>

<Title value="Order Details" />

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[800px] max-w-full flex-col gap-[10px] pl-[15px] pr-[15px]"
>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Detail</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>Order ID: {data.id}</p>
			<p>Status: <b>{data.state} {data.delivered ? 'and DELIVERED' : ''}</b></p>
			{#if !data.productID}
				<div class="flex gap-[10px]">
					<p>Shipping info:</p>
					<div>
						<p>{data.recipentName}</p>
						<p>{data.address}</p>
						<p>+84 {String(data.phone).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}</p>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Items</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Body>
					{#each data.orderItems as item}
						<Table.Row>
							<div class="border-box flex gap-[10px] p-[10px]">
								<a href={`/store/product/${item.productID}`}>
									<img
										class="h-[65px] w-[65px] rounded-lg object-cover"
										src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/products/${item.productID}/0.webp`}
										alt="product"
									/>
								</a>
								<div>
									<a href={`/store/product/${item.productID}`}>
										<h3 class="text-lg font-semibold">
											{item.products.name}
										</h3>
									</a>
									<p>
										Qty: {item.quantity}
									</p>
								</div>
								<div class="ml-auto flex items-center">
									{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
										item.quantity * item.products.price
									)}
								</div>
							</div>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<div class="mt-[15px]">
				<div class="flex">
					<p>Subtotal</p>
					<p class="ml-auto">
						<b>
							{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
								data.amount
							)}
						</b>
					</p>
				</div>
				{#if !data.productID}
					<div class="flex">
						<p>Shipping fee</p>
						<p class="ml-auto">
							<b>
								{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
									data.fee
								)}
							</b>
						</p>
					</div>
				{/if}
				<div class="mt-[10px] flex">
					<p class="text-lg">
						<b>Total</b>
					</p>
					<p class="ml-auto text-lg">
						<b>
							{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
								data.amount + data.fee
							)}
						</b>
					</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
	{#if !data.productID}
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title>Tracking</Card.Title>
			</Card.Header>
			<Card.Content>
				<div>
					{#if data.orderTracking && data.orderTracking.length > 0}
						{#each data.orderTracking as item, i}
							<div class="relative flex">
								<div class="mr-4 flex flex-col items-center">
									<div class="h-4 w-4 rounded-full bg-gray-400 dark:bg-gray-600"></div>
									{#if i !== data.orderTracking.length - 1}
										<div class=" absolute my-1 h-full w-[2px] bg-gray-400 dark:bg-gray-600"></div>
									{/if}
								</div>
								<div class="flex-1 pb-4">
									<p class="text-sm text-muted-foreground">
										{new Date(item.created_at).toLocaleDateString('vi-VN')} -
										{new Date(item.created_at).toLocaleTimeString('vi-VN')}
									</p>
									{#if item.link}
										<a href={item.link}>
											<p>{item.content}</p>
										</a>
									{:else}
										<p>{item.content}</p>
									{/if}
								</div>
							</div>
						{/each}
					{:else}
						<p class="italic text-muted-foreground">No tracking information available yet</p>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
	<Button class="ml-auto w-fit" variant="destructive" disabled={cancellable}>Cancel order</Button>
</div>
