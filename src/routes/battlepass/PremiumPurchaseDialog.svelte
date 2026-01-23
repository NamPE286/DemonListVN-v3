<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Crown from 'lucide-svelte/icons/crown';
	import Check from 'lucide-svelte/icons/check';
	import { PREMIUM_PRICE } from '$lib/battlepass/constants';

	export let open: boolean = false;
	export let seasonTitle: string = '';

	async function purchasePremium() {
		try {
			toast.loading($_('toast.payment.redirect'));

			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/payment/getPaymentLink/6/1`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${await $user.token()}`,
						'Content-Type': 'application/json'
					}
				}
			);

			if (res.ok) {
				const data = await res.json();
				window.location.href = data.checkoutUrl;
			} else {
				const error = await res.text();
				toast.error(error || 'Failed to create payment link');
			}
		} catch (e) {
			toast.error('Failed to initiate purchase');
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
					<Crown class="h-6 w-6 text-primary-foreground" />
				</div>
				<span>{$_('battlepass.upgrade_to_premium')}</span>
			</Dialog.Title>
		</Dialog.Header>

		<div class="mt-4 flex flex-col gap-4">
			<p class="text-sm text-muted-foreground">
				{$_('battlepass.premium_description')}
			</p>

			<div class="rounded-lg border-2 p-4">
				<div class="mb-3 flex items-center justify-between">
					<span class="font-medium">{seasonTitle} {$_('battlepass.premium_pass')}</span>
					<span class="text-xl font-bold text-primary">
						{formatCurrency(PREMIUM_PRICE)}
					</span>
				</div>
				<ul class="space-y-2 text-sm text-muted-foreground">
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 flex-shrink-0 text-green-400" />
						<span>{$_('battlepass.premium_benefits.instant_rewards')}</span>
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 flex-shrink-0 text-green-400" />
						<span>{$_('battlepass.premium_benefits.exclusive_items')}</span>
					</li>
					<li class="flex items-center gap-2">
						<Check class="h-4 w-4 flex-shrink-0 text-green-400" />
						<span>{$_('battlepass.premium_benefits.double_rewards')}</span>
					</li>
				</ul>
			</div>

			<p class="text-xs italic text-muted-foreground">
				{$_('payment.review.caution')}
			</p>
		</div>

		<Dialog.Footer class="mt-4 gap-2 sm:gap-0">
			<Button variant="outline" on:click={() => (open = false)}>
				{$_('general.cancel')}
			</Button>
			<Button on:click={purchasePremium}>
				{$_('payment.review.proceed')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
