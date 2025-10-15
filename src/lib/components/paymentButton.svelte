<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { user } from '$lib/client';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import { Input } from '$lib/components/ui/input';
	import Loading from '$lib/components/animation/loading.svelte';
	import PlayerHoverCard from '$lib/components/playerCard.svelte';
	import { _, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';

	export let title: string;

	let state = 0;
	let nextState = 0;
	let quantity = [1];
	let giftToUID: string = '';
	let giftTo: any;
	let fetchState: number = 0;

	function reset() {
		state = 0;
		nextState = 0;
		quantity = [1];
		giftToUID = '';
		giftTo = undefined;
		fetchState = 0;
	}

	async function fetchPlayer() {
		fetchState = 1;

		try {
			giftTo = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${giftToUID}`)).json();
			fetchState = 2;
		} catch {
			toast.error(get(_)("toast.payment.no_player"));
			fetchState = 0;
		}
	}

	async function purchase() {
		toast.loading(get(_)('toast.payment.redirect'));

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
		return x.toLocaleString('vi-VN');
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants()} disabled={!$user.loggedIn} on:click={reset}
		>{title}</Dialog.Trigger
	>
	<Dialog.Content>
		{#if state == 0}
			<Dialog.Header>
				<Dialog.Title>{$_("payment.recipent.title")}</Dialog.Title>
			</Dialog.Header>
			<div class="flex flex-col gap-[5px]">
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${nextState == 2 ? 'border-white' : ''}`}
					on:click={() => {
						nextState = 2;
					}}>{$_("payment.recipent.self")}</Button
				>
				<Button
					variant="outline"
					class={`h-[70px] justify-start ${nextState == 1 ? 'border-white' : ''}`}
					on:click={() => {
						nextState = 1;
					}}>{$_("payment.recipent.friend")}</Button
				>
			</div>
			<Dialog.Footer>
				<Button
					disabled={nextState == 0}
					on:click={() => {
						state = nextState;
					}}>{$_("general.next")}</Button
				>
			</Dialog.Footer>
		{:else if state == 1}
			<Dialog.Header>
				<Dialog.Title>{$_("payment.gift.title")}</Dialog.Title>
			</Dialog.Header>
			<div>
				<div class="mb-[20px] flex gap-[10px]">
					<Input bind:value={giftToUID} placeholder="Player's UID" />
					<Button on:click={fetchPlayer} disabled={fetchState != 0}>{$_("general.select")}</Button>
				</div>
				<div class="flex items-center justify-center">
					{#if fetchState == 1}
						<Loading inverted={true} />
					{:else if fetchState == 2}
						{$_("payment.gift.confirm")} <span class="ml-[5px] font-bold"
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
					}}>{$_("general.next")}</Button
				>
			</Dialog.Footer>
		{:else if state == 2}
			<Dialog.Header>
				<Dialog.Title>{$_("payment.quantity.title")}</Dialog.Title>
			</Dialog.Header>
			<div>
				<p>{formatPrice(49000 * quantity[0])}₫/{quantity[0]} {$_("general.month")}{quantity[0] > 1 && $locale == 'en' ? 's' : ''}</p>
				<Slider bind:value={quantity} max={12} step={1} />
			</div>
			<Dialog.Footer>
				<Button
					disabled={!quantity[0]}
					on:click={() => {
						state = 3;
					}}>{$_("general.next")}</Button
				>
			</Dialog.Footer>
		{:else if state == 3}
			<Dialog.Header>
				<Dialog.Title>{$_("payment.review.title")}</Dialog.Title>
			</Dialog.Header>
			<div class="flex text-sm">
				<p>Demon List VN Supporter Role ({quantity[0]} {$_("general.month")}{quantity[0] > 1 && $locale == 'en' ? 's' : ''})</p>
				<p class="ml-auto"><b>{formatPrice(49000 * quantity[0])}₫</b></p>
			</div>
			<hr />
			<div class="flex text-sm">
				<p>{$_("payment.review.recipent")}</p>
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
				{$_("payment.review.caution")}
			</p>
			<Dialog.Footer>
				<Button on:click={purchase}>{$_("payment.review.proceed")}</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
