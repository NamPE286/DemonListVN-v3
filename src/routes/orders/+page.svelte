<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	let orders: any[] = [];

	async function getOrders() {
		orders = await (
			await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + (await $user.token()),
					'Content-Type': 'application/json'
				}
			})
		).json();
	}

	async function restore(order: any) {
		toast.loading('Restoring your order...');
		window.location.href = `${import.meta.env.VITE_API_URL}/payment/success?orderCode=${order.id}`;
	}

	onMount(() => {
		getOrders();
	});
</script>

<svelte:head>
	<title>Orders - Demon List VN</title>
</svelte:head>

{#if $user.loggedIn}
	<Title value="Orders" />
	<div class="min-w-[1300px] pl-[10px] pr-[10px] lg:pl-[70px] lg:pr-[70px]">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[180px]">ID</Table.Head>
					<Table.Head class="w-[180px]">Product</Table.Head>
					<Table.Head class="w-[50px]">Qty</Table.Head>
					<Table.Head class="w-[120px]">Amount</Table.Head>
					<Table.Head class="w-[150px]">Recipent</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-right">Action</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each orders as order}
					<Table.Row>
						<Table.Cell class="font-medium">{order.id}</Table.Cell>
						<Table.Cell>{order.productID ? order.products.name : "Store Item(s)"}</Table.Cell>
						<Table.Cell>{order.quantity ? order.quantity : "?"}</Table.Cell>
						<Table.Cell>
							{new Intl.NumberFormat('vi-VN', {
								style: 'currency',
								currency: order.currency
							}).format(order.amount + order.fee)}
						</Table.Cell>
						<Table.Cell>
							{#if order.giftTo}
								<PlayerHoverCard player={order.players} />
							{:else}
								<PlayerHoverCard player={$user.data} />
							{/if}
						</Table.Cell>
						<Table.Cell>{order.state} {order.delivered ? 'and DELIVERED' : ''}</Table.Cell>
						<Table.Cell class="text-right">
							<Button
								variant="secondary"
								on:click={() => restore(order)}
								disabled={!(order.state == 'PENDING' && order.paymentMethod == 'Bank Transfer')}>Restore</Button
							>
							<a href={`/orders/${order.id}`}>
								<Button variant="secondary">Detail</Button>
							</a>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}
