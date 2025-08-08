<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cart } from '$lib/client/cart';
	import { user } from '$lib/client/user';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';

	export let items: any[];

	let paymentMethod = '';
	let recipientName = '';
	let address = '';
	let phone = '';
	let state = 0;
	let shippingFee = 0;

	async function bankTransfer() {
		toast.loading('You will be redirected to our payment portal');

		const res: any = await (
			await fetch(`${import.meta.env.VITE_API_URL}/payment/getPaymentLink`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + (await $user.token()),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					items: $cart.items,
					address: address,
					phone: parseInt(phone),
					recipientName: recipientName
				})
			})
		).json();

		$cart.clear();
		window.location.href = res.checkoutUrl;
	}

	async function COD() {
		let orderID = 0;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/order`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + (await $user.token()),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					items: $cart.items,
					address: address,
					phone: parseInt(phone),
					recipientName: recipientName
				})
			})
				.then((res) => res.json())
				.then((res: any) => (orderID = res.orderID)),
			{
				success: () => {
					$cart.clear();
					window.location.href = `/orders/${orderID}`;
					return 'Order placed!';
				},
				loading: 'Placing order...',
				error: 'Failed to place order'
			}
		);
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		on:click={() => (state = 0)}
		class="ml-auto mr-auto w-fit"
		disabled={$cart.items.length == 0 || !($user.loggedIn && $user.data.discord)}
	>
		<Button
			class="w-[200px]"
			disabled={$cart.items.length == 0 || !($user.loggedIn && $user.data.discord)}>Checkout</Button
		>
	</Dialog.Trigger>
	<Dialog.Content>
		{#if state == 0}
			<Dialog.Header>
				<Dialog.Title>Select payment method</Dialog.Title>
			</Dialog.Header>
			<div class="flex flex-col gap-[5px]">
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${paymentMethod == 'Bank Transfer' ? 'border-white' : ''}`}
					on:click={() => {
						paymentMethod = 'Bank Transfer';
						shippingFee = 25000;
					}}
				>
					Bank Transfer
				</Button>
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${paymentMethod == 'COD' ? 'border-white' : ''}`}
					on:click={() => {
						paymentMethod = 'COD';
						shippingFee = 25000;
					}}
				>
					Cash on Delivery
				</Button>
				<Dialog.Footer>
					<Button
						disabled={paymentMethod == ''}
						on:click={() => {
							state = 1;
						}}
					>
						Next
					</Button>
				</Dialog.Footer>
			</div>
		{:else if state == 1}
			<Dialog.Header>
				<Dialog.Title>Add shipping details</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Address</Label>
				<Textarea
					class="col-span-3"
					placeholder="Enter your shipping address"
					bind:value={address}
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Recipient's name</Label>
				<Input class="col-span-3" placeholder="Required" bind:value={recipientName} />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Phone number</Label>
				<div class="col-span-3 flex gap-[10px]">
					<Input class="w-[50px] disabled:opacity-100" value="+84" disabled />
					<Input bind:value={phone} type="tel" placeholder="Example: 978123456" />
				</div>
			</div>
			<Dialog.Footer>
				<Button
					disabled={!address || !recipientName || phone.length != 9}
					on:click={() => {
						state = 2;
					}}
				>
					Next
				</Button>
			</Dialog.Footer>
		{:else if state == 2}
			<Dialog.Header>
				<Dialog.Title>Review your order</Dialog.Title>
			</Dialog.Header>
			<div class="flex flex-col gap-[10px]">
				<h3 class="font-bold">Shipping Infomation</h3>
				<div class="flex text-sm">
					<p>Recipient</p>
					<p class="ml-auto">
						<b>
							{recipientName}
						</b>
					</p>
				</div>
				<div class="flex text-sm">
					<p>Shipping Address</p>
					<p class="ml-auto">
						{address}
					</p>
				</div>
				<div class="flex text-sm">
					<p>Phone number</p>
					<p class="ml-auto">
						+84 {phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
					</p>
				</div>
			</div>
			<hr />
			<div class="flex flex-col gap-[10px]">
				<h3 class="font-bold">Items</h3>
				{#each items as item}
					<div class="flex text-sm">
						<p>{item.name} x{$cart.getItem(item.id).quantity}</p>
						<p class="ml-auto">
							<b>
								{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
									$cart.getItem(item.id).quantity * item.price
								)}
							</b>
						</p>
					</div>
				{/each}
			</div>
			<hr />
			<div class="flex flex-col gap-[10px]">
				<div class="flex text-sm">
					<p>Subtotal</p>
					<p class="ml-auto">
						<b>
							{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
								items.reduce(
									(total, item) => total + $cart.getItem(item.id).quantity * item.price,
									0
								)
							)}
						</b>
					</p>
				</div>
				<div class="flex text-sm">
					<p>Shipping Fee</p>
					<p class="ml-auto">
						<b>
							{#if shippingFee == 0}
								Free
							{:else}
								{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
									shippingFee
								)}
							{/if}
						</b>
					</p>
				</div>
			</div>
			<div class="text-md flex font-bold">
				<p>Total</p>
				<p class="ml-auto">
					<b>
						{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
							items.reduce(
								(total, item) => total + $cart.getItem(item.id).quantity * item.price,
								0
							) + shippingFee
						)}
					</b>
				</p>
			</div>
			<p class="text-sm italic text-gray-500">
				{#if paymentMethod == 'Bank Transfer'}
					Please do not close the payment window until you are redirected back to Demon List VN
				{:else if paymentMethod == 'COD'}
					Payment will be collected upon delivery by our shipping partner
				{/if}
			</p>
			<Dialog.Footer>
				{#if paymentMethod == 'Bank Transfer'}
					<Button on:click={bankTransfer}>Proceed to Payment</Button>
				{:else if paymentMethod == 'COD'}
					<Button on:click={COD}>Place Order</Button>
				{/if}
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
