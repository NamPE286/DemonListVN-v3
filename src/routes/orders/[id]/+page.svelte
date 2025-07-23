<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import AddTrackingButton from './addTrackingButton.svelte';

	let data: any = null;

	function cancellable() {
		if (data.state == 'CANCELLED' || data.paymentMethod == 'Bank Transfer') {
			return false;
		}

		for (const i of data.orderTracking) {
			if (i.delivering) {
				return false;
			}
		}

		return true;
	}

	function cancel() {
		if (!confirm('Cancel this order?')) {
			return;
		}

		toast.loading('Cancelling...');
		window.location.href = `${import.meta.env.VITE_API_URL}/payment/cancelled?orderCode=${data.id}`;
	}

	async function fetchData() {
		data = await (
			await fetch(`${import.meta.env.VITE_API_URL}/order/${page.params.id}`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			})
		).json();

		data.orderTracking.push({
			created_at: data.created_at,
			content: 'Order created'
		});
	}

	onMount(async () => {
		user.subscribe(async (currentUser) => {
			if (currentUser) {
				await fetchData();
			}
		});

		await fetchData();
	});
</script>

<svelte:head>
	<title>Order Details - Demon List VN</title>
</svelte:head>

<Title value="Order Details" />

{#if data}
	<div
		class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[800px] max-w-full flex-col gap-[10px] pl-[15px] pr-[15px]"
	>
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title>Detail</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>Order ID: {data.id}</p>
				<p>Payment status: <b>{data.state}</b></p>
				<p>Payment method: {data.paymentMethod}</p>
				{#if !data.productID}
					<div class="flex gap-[10px]">
						<p>Shipping info:</p>
						<div>
							<p>{data.recipientName}</p>
							<p>{data.address}</p>
							<p>+84 {data.phone}</p>
						</div>
					</div>
				{:else}
					<div class="flex gap-[5px]">
						Recipient:
						{#if data.giftTo}
							<PlayerHoverCard player={data.players} />
						{:else}
							<PlayerHoverCard player={$user.data} />
						{/if}
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
					{#if $user.loggedIn && $user.data.isAdmin}
						<div class="mb-[10px]">
							<AddTrackingButton order={data} />
						</div>
					{/if}
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
				</Card.Content>
			</Card.Root>
		{/if}
		<Button class="ml-auto w-fit" variant="destructive" disabled={!cancellable()} on:click={cancel}>
			Cancel order
		</Button>
		<div class="mt-[25px] text-sm text-gray-400">
			<p>Note:</p>
			<ul>
				<li>- Orders in delivery cannot be cancelled.</li>
				<li>- Prepaid orders require manual cancellation.</li>
				<li>
					- For refunds or cancellations, please contact @nampe286 on Discord or email
					nambuihung654@gmail.com.
				</li>
			</ul>
		</div>
	</div>
{/if}
