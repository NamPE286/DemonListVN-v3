<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { _ } from 'svelte-i18n';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';
	import { page } from '$app/stores';
	import { Star, Zap, Sparkles, Gift } from 'lucide-svelte';

	const STORAGE_KEY = 'supporter_popup_dismissed';

	let open = false;
	let unsubscribe: (() => void) | null = null;
	let timeout: ReturnType<typeof setTimeout> | null = null;

	function shouldShowPopup(): boolean {
		if (!browser) return false;

		// Don't show if already dismissed
		if (localStorage.getItem(STORAGE_KEY) === 'true') return false;

		return true;
	}

	function dismissPopup() {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, 'true');
		}
		open = false;
	}

	function handleLearnMore() {
		dismissPopup();
		goto('/supporter');
	}

	onMount(() => {
		// Wait a bit for user data to load, then check if we should show popup
		timeout = setTimeout(() => {
			unsubscribe = user.subscribe((u) => {
				// Only show for non-supporters and only if not already opened
				if (!open && u.checked && (!u.loggedIn || !isActive(u.data?.supporterUntil))) {
					// Don't show on supporter page
					const pathname = $page.url.pathname;
					if (pathname !== '/supporter' && !pathname.startsWith('/supporter/')) {
						if (shouldShowPopup()) {
							open = true;
						}
					}
				}
			});
		}, 2000); // Wait 2 seconds before showing
	});

	onDestroy(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-center text-2xl">{$_('supporter.popup.title')}</Dialog.Title>
			<Dialog.Description class="text-center">
				{$_('supporter.popup.description')}
			</Dialog.Description>
		</Dialog.Header>

		<div class="my-4 space-y-3">
			<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
					<Star class="h-5 w-5 text-yellow-500" />
				</div>
				<span class="font-medium">{$_('supporter.popup.perk_no_ads')}</span>
			</div>

			<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
					<Zap class="h-5 w-5 text-blue-500" />
				</div>
				<span class="font-medium">{$_('supporter.popup.perk_priority')}</span>
			</div>

			<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20">
					<Sparkles class="h-5 w-5 text-pink-500" />
				</div>
				<span class="font-medium">{$_('supporter.popup.perk_animated')}</span>
			</div>

			<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
					<Gift class="h-5 w-5 text-green-500" />
				</div>
				<span class="font-medium">{$_('supporter.popup.perk_more')}</span>
			</div>
		</div>

		<Dialog.Footer class="flex-col gap-2 sm:flex-col">
			<Button class="w-full bg-yellow-500 hover:bg-yellow-600" on:click={handleLearnMore}>
				{$_('supporter.popup.learn_more')}
			</Button>
			<Button variant="ghost" class="w-full" on:click={dismissPopup}>
				{$_('supporter.popup.dismiss')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
