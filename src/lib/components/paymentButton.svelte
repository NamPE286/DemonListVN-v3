<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { user } from '$lib/client';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import { Input } from '$lib/components/ui/input';
	import Loading from '$lib/components/animation/loading.svelte';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let title: string;

	let state = 0;
	let nextState = 0;
	let quantity = [1];
	let giftToUID: string = '';
	let giftTo: any;
	let fetchState: number = 0;

	async function fetchPlayer() {
		fetchState = 1;

		try {
			giftTo = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${giftToUID}`)).json();
			fetchState = 2;
		} catch {
			toast.error('Player not found');
			fetchState = 0;
		}
	}

	async function purchase() {
		toast.loading('You will be redirected to our payment portal');

		const res: any = await (
			await fetch(
				`${import.meta.env.VITE_API_URL}/payment/getPaymentLink/1/${quantity[0]}${giftToUID ? `?giftTo=${giftToUID}` : ''}`,
				{
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + (await $user.token()),
						'Content-Type': 'application/json'
					}
				}
			)
		).json();

		window.location.href = res.checkoutUrl;
	}

	function formatPrice(x: number) {
		return x.toLocaleString('de-DE');
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants()}
		disabled={!$user.loggedIn}
		on:click={() => {
			state = 0;
		}}>{title}</Dialog.Trigger
	>
	<Dialog.Content>
		{#if state == 0}
			<Dialog.Header>
				<Dialog.Title>Who are you buying this for</Dialog.Title>
			</Dialog.Header>
			<div class="flex flex-col gap-[5px]">
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${nextState == 2 ? 'border-white' : ''}`}
					on:click={() => {
						nextState = 2;
					}}>For myself</Button
				>
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${nextState == 1 ? 'border-white' : ''}`}
					on:click={() => {
						nextState = 1;
					}}>For a friend</Button
				>
			</div>
			<Dialog.Footer>
				<Button
					disabled={nextState == 0}
					on:click={() => {
						state = nextState;
					}}>Next</Button
				>
			</Dialog.Footer>
		{:else if state == 1}
			<Dialog.Header>
				<Dialog.Title>Select a friend to gift</Dialog.Title>
			</Dialog.Header>
			<div>
				<div class="mb-[20px] flex gap-[10px]">
					<Input bind:value={giftToUID} placeholder="Player's UID" />
					<Button on:click={fetchPlayer} disabled={fetchState != 0}>Select</Button>
				</div>
				<div class="flex justify-center">
					{#if fetchState == 1}
						<Loading inverted={true} />
					{:else if fetchState == 2}
						You are going to gift <span class="ml-[5px] font-bold"
							><PlayerHoverCard player={giftTo} /></span
						>
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Button
					disabled={giftTo === undefined}
					on:click={() => {
						state = 2;
					}}>Next</Button
				>
			</Dialog.Footer>
		{:else if state == 2}
			<Dialog.Header>
				<Dialog.Title>Select quantity</Dialog.Title>
			</Dialog.Header>
			<div>
				<p>{formatPrice(22000 * quantity[0])}₫/{quantity[0]} month</p>
				<Slider bind:value={quantity} max={12} step={1} />
			</div>
			<Dialog.Footer>
				<Button
					disabled={!quantity[0]}
					on:click={() => {
						state = 3;
					}}>Next</Button
				>
			</Dialog.Footer>
		{:else if state == 3}
			<Dialog.Header>
				<Dialog.Title>Review your order</Dialog.Title>
			</Dialog.Header>
			<div class="flex text-sm">
				<p>Demon List VN Supporter Role ({quantity[0]} month{quantity[0] > 1 ? 's' : ''})</p>
				<p class="ml-auto"><b>{formatPrice(22000 * quantity[0])}₫</b></p>
			</div>
			<div class="flex text-sm">
				<p>Recipent</p>
				<p class="ml-auto">
					<b>
						{#if giftTo}
							<PlayerHoverCard player={giftTo} />
						{:else}
							<PlayerHoverCard player={$user.data} />
						{/if}
					</b>
				</p>
			</div>
			<p class="text-sm italic text-gray-500">
				Please do not close the payment window until you are redirected back to Demon List VN
			</p>
			<Dialog.Footer>
				<Button on:click={purchase}>Proceed to Payment</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
