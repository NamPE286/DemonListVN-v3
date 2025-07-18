<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cart } from '$lib/client/cart';
	import { user } from '$lib/client/user';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let items: any[];

	let paymentMethod = '';
	let address = '';
	let state = 0;

	async function bankTransfer() {}

	async function COD() {}
</script>

<Dialog.Root>
	<Dialog.Trigger on:click={() => (state = 0)}>
		<Button class="ml-auto mr-auto w-full max-w-[200px]" disabled={$cart.items.length == 0}>
			Checkout
		</Button>
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
					}}
				>
					Bank Transfer
				</Button>
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${paymentMethod == 'COD' ? 'border-white' : ''}`}
					on:click={() => {
						paymentMethod = 'COD';
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
			<Dialog.Footer>
				<Button
					disabled={paymentMethod == ''}
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
			{#each items as item}
				<div class="flex text-sm">
					<p>{item.name}</p>
					<p class="ml-auto">
						<b>
							{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
								$cart.getItem(item.id).quantity * item.price
							)}
						</b>
					</p>
				</div>
			{/each}
			<hr />
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
					<b> Vietnam </b>
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
