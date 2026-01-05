<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';

	const STORAGE_KEY = 'supporter_promo_shown';
	let open = false;

	onMount(() => {
		// Check if popup has been shown before
		const hasShown = localStorage.getItem(STORAGE_KEY);
		if (hasShown) {
			return;
		}

		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let unsubscribed = false;

		// Wait for user data to be checked, then show popup after a delay
		const unsubscribe = user.subscribe((u) => {
			if (u.checked && !unsubscribed) {
				// Don't show if user is already a supporter
				if (u.loggedIn && u.data && isActive(u.data.supporterUntil)) {
					unsubscribed = true;
					unsubscribe();
					return;
				}

				// Show popup after 2 seconds
				timeoutId = setTimeout(() => {
					open = true;
				}, 2000);

				unsubscribed = true;
				unsubscribe();
			}
		});

		return () => {
			if (!unsubscribed) {
				unsubscribe();
			}
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});

	function handleClose() {
		open = false;
		localStorage.setItem(STORAGE_KEY, 'true');
	}

	function handleLearnMore() {
		localStorage.setItem(STORAGE_KEY, 'true');
		window.location.href = '/supporter';
	}
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => !isOpen && handleClose()}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-center text-2xl">
				{$_('supporter_promo.title')}
			</Dialog.Title>
			<Dialog.Description class="text-center">
				{$_('supporter_promo.description')}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<div class="grid grid-cols-1 gap-3">
				<div class="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
					<span class="text-xl">✨</span>
					<div>
						<p class="font-medium">{$_('supporter_promo.perks.highlighted_name')}</p>
					</div>
				</div>
				<div class="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
					<span class="text-xl">🎬</span>
					<div>
						<p class="font-medium">{$_('supporter_promo.perks.animated_media')}</p>
					</div>
				</div>
				<div class="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
					<span class="text-xl">🚫</span>
					<div>
						<p class="font-medium">{$_('supporter_promo.perks.ads_free')}</p>
					</div>
				</div>
				<div class="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
					<span class="text-xl">⚡</span>
					<div>
						<p class="font-medium">{$_('supporter_promo.perks.priority_queue')}</p>
					</div>
				</div>
			</div>

			<p class="text-center text-sm text-muted-foreground">
				{$_('supporter_promo.more_perks')}
			</p>
		</div>

		<Dialog.Footer class="flex-col gap-2 sm:flex-col">
			<Button class="w-full bg-yellow-400 hover:bg-yellow-500" on:click={handleLearnMore}>
				{$_('supporter_promo.learn_more_button')}
			</Button>
			<Button variant="ghost" class="w-full" on:click={handleClose}>
				{$_('supporter_promo.maybe_later')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
