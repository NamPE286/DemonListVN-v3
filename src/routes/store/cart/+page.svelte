<script lang="ts">
	import { cart } from '$lib/client/cart';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Cross2 } from 'svelte-radix';
	import { toast } from 'svelte-sonner';
	import CheckoutButton from './checkoutButton.svelte';

	let data: any[] = [];

	async function fetchData() {
		if (!$cart.items.length) {
			return;
		}

		data = await (
			await fetch(
				`${import.meta.env.VITE_API_URL}/store/products?ids=${JSON.stringify($cart.queryArray())}`
			)
		).json();
	}

	onMount(async () => {
		await fetchData();
	});
</script>

<svelte:head>
	<title>Cart - Demon List VN</title>
</svelte:head>

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[1200px] max-w-full items-center pl-[15px] pr-[15px]"
>
	<h2>Cart</h2>
</div>
{#if $cart.items.length}
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
						<Table.Cell class="w-[300px]">
							<a href={`/store/product/${product.id}`}> {product.name}</a>
						</Table.Cell>
						<Table.Cell class="w-[50px] text-center">
							{$cart.getItem(product.id)?.quantity}
						</Table.Cell>
						<Table.Cell class="w-[200px]">
							{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
								product.price * $cart.getItem(product.id).quantity
							)}
						</Table.Cell>
						<Table.Cell class="text-right">
							<Button
								variant="destructive"
								size="icon"
								on:click={() => {
									$cart.removeItem(product.id);
									data = data.filter((item) => item.id !== product.id);
									toast.success(`Removed ${product.name} from the cart.`);
								}}
							>
								<Cross2 size={16} />
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<div class="flex justify-end">
			<p class="text-right text-lg">
				Total<br />
				<span class="text-2xl font-semibold">
					{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
						data.reduce((total, product) => {
							return total + product.price * $cart.getItem(product.id).quantity;
						}, 0)
					)}
				</span>
			</p>
		</div>
		<CheckoutButton bind:items={data} />
	</div>
{:else}
	<p class="text-center opacity-50">No item in cart</p>
{/if}

<style lang="scss">
	h2 {
		font-weight: 600;
		font-size: 35px;
	}
</style>
