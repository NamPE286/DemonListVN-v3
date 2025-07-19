<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cart } from '$lib/client/cart';
	import { user } from '$lib/client/user';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	export let items: any[];

	let paymentMethod = '';
	let address = '';
	let phone = '';
	let state = 0;
	let shippingFee = 0;

	async function bankTransfer() {}

	async function COD() {}
</script>

<Dialog.Root>
	<Dialog.Trigger on:click={() => (state = 0)} class="ml-auto mr-auto w-fit">
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
						shippingFee = 0;
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
				<Label class="text-right">Phone number</Label>
				<Input class="col-span-3" bind:value={phone} type="tel" placeholder="0978123456" />
			</div>
			<Dialog.Footer>
				<Button
					disabled={address.length < 10 || phone.length != 10}
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
				<h3 class="font-bold">Order's Infomation</h3>
				<div class="flex text-sm">
					<p>Recipent</p>
					<p class="ml-auto">
						<b>
							<PlayerHoverCard player={$user.data} />
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
						{phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
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
