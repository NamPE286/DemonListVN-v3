<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { user } from '$lib/client';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';

	export let data: any;

	let state = 0;
	let nextState = 0;
	let quantity = [1];
	let fetchState: number = 0;

	function reset() {
		state = 0;
		nextState = 0;
		quantity = [1];
		fetchState = 0;
	}

	async function purchase() {
		toast.loading('You will be redirected to our payment portal');

		const res: any = await (
			await fetch(
				`${import.meta.env.VITE_API_URL}/payment/getPaymentLink/3/${quantity[0]}${data.id ? `?targetClanID=${data.id}` : ''}`,
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
		return x.toLocaleString('vi-VN');
	}
</script>

<Dialog.Root>
	<Dialog.Trigger disabled={!$user.loggedIn} on:click={reset} class="w-full">
		<Button
			variant="outline"
			class="w-full border-[#f400ea] bg-[#510057] text-white hover:bg-[#870091]"
		>
			Boost this clan
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		{#if state == 0}
			<Dialog.Header>
				<Dialog.Title>Select quantity</Dialog.Title>
			</Dialog.Header>
			<div>
				<p>{formatPrice(5000 * quantity[0])}₫/{quantity[0]} day{quantity[0] <= 1 ? '' : 's'}</p>
				<Slider bind:value={quantity} max={30} step={1} />
			</div>
			<Dialog.Footer>
				<Button
					disabled={!quantity[0]}
					on:click={() => {
						state = 1;
					}}>Next</Button
				>
			</Dialog.Footer>
		{:else if state == 1}
			<Dialog.Header>
				<Dialog.Title>Review your order</Dialog.Title>
			</Dialog.Header>
			<div class="flex text-sm">
				<p>Clan Boost ({quantity[0]} day{quantity[0] > 1 ? 's' : ''})</p>
				<p class="ml-auto"><b>{formatPrice(5000 * quantity[0])}₫</b></p>
			</div>
			<hr />
			<div class="flex text-sm">
				<p>Recipent Clan</p>
				<p class="ml-auto">
					<b>
						[{data.tag}] {data.name}
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
