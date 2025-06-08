<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

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

	function formatPrice(x: number) {
		return x.toLocaleString('vi-VN');
	}

	async function pay(order: any) {
		toast.loading('Checking order...');

		const payment = await (
			await fetch(`${import.meta.env.VITE_API_URL}/orders/getPaymentLink/${order.id}`)
		).json();

		if (payment.status == 'PAID') {
			toast.error("This order is paid. Please click on Restore if you haven't receive your order.");

			return;
		}

		if (payment.status == 'CANCELLED') {
			toast.error('This order is cancelled.');

			return;
		}

		toast.loading('You will be redirected to our payment portal');

		window.location.href = `https://pay.payos.vn/web/${payment.id}`;
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
					<Table.Head class="w-[60px]">Quantity</Table.Head>
					<Table.Head class="w-[60px]">Discount</Table.Head>
					<Table.Head class="w-[100px]">Coupon</Table.Head>
					<Table.Head class="w-[120px]">Amount</Table.Head>
					<Table.Head class="w-[180px]">Recipent</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-right">Action</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each orders as order}
					<Table.Row>
						<Table.Cell class="font-medium">{order.id}</Table.Cell>
						<Table.Cell>{order.products.name}</Table.Cell>
						<Table.Cell>{order.quantity}</Table.Cell>
						<Table.Cell>{Math.round(order.discount * 100)}%</Table.Cell>
						<Table.Cell>{order.coupon ? order.coupon : '-'}</Table.Cell>
						<Table.Cell>{order.amount} {order.currency}</Table.Cell>
						<Table.Cell>{order.giftTo ? order.giftTo : '-'}</Table.Cell>
						<Table.Cell>{order.state}</Table.Cell>
						<Table.Cell class="text-right">
							<Button
								variant="secondary"
								on:click={() => pay(order)}
								disabled={order.state != 'PENDING'}>Pay</Button
							>
							<Button
								variant="secondary"
								on:click={() => restore(order)}
								disabled={order.state == 'CANCELLED'}>Restore</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}
