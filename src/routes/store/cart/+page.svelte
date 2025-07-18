<script lang="ts">
	import { cart } from '$lib/client/cart';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Cross2 } from 'svelte-radix';

	let data: any[] = [];

	async function fetchData() {
		data = await (
			await fetch(
				`${import.meta.env.VITE_API_URL}/store/products?ids=${JSON.stringify($cart.queryArray())}`
			)
		).json();
	}

	onMount(async () => {
		await fetchData();
		console.log(data);
	});
</script>

<svelte:head>
	<title>Store - Demon List VN</title>
</svelte:head>

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[1200px] max-w-full items-center pl-[15px] pr-[15px]"
>
	<h2>Cart</h2>
</div>

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[1200px] max-w-full flex-col justify-center gap-[15px] pl-[15px] pr-[15px]"
>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[300px]">Product</Table.Head>
				<Table.Head class="w-[50px] text-center">Qty</Table.Head>
				<Table.Head class="w-[200px]">Amount</Table.Head>
				<Table.Head class="text-right">Action</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data as product}
				<Table.Row>
					<Table.Cell class="w-[300px]">{product.name}</Table.Cell>
					<Table.Cell class="w-[50px] text-center">
						{$cart.getItem(product.id)?.quantity}
					</Table.Cell>
					<Table.Cell class="w-[200px]">
						{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
							product.price * $cart.getItem(product.id).quantity
						)}
					</Table.Cell>
					<Table.Cell class="text-right">
						<Button variant="destructive" size="icon">
							<Cross2 size={16} />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
	<Button class="ml-auto mr-auto w-full max-w-[200px]">Checkout</Button>
</div>

<style lang="scss">
	h2 {
		font-weight: 600;
		font-size: 35px;
	}
</style>
