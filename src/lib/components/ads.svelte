<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';

	export let dataAdFormat = 'auto';
	export let unit = 'auto';
	let enabled = true;
	let mounted = false;

	onMount(() => {
		if (!enabled) {
			return;
		}

		if (mounted) {
			return;
		}

		mounted = true;

		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error(err);
		}

		// user.subscribe((p) => {
		// 	if (p.data && isActive(p.data.supporterUntil)) {
		// 		enabled = false;
		// 	}
		// });
	});
</script>

{#if enabled}
	{#if unit == 'auto'}
		<div class="text-center">
			<ins
				class="adsbygoogle ad"
				style="display:block"
				data-ad-client="ca-pub-4605218533506777"
				data-ad-slot="7284584064"
				data-ad-format={dataAdFormat}
				data-full-width-responsive="true"
				data-adtest="on"
			></ins>
		</div>
	{:else if unit == 'leaderboard'}
		<div class="text-center">
			<ins
				class="adsbygoogle ad"
				style="display:inline-block;width:728px;height:90px"
				data-ad-client="ca-pub-4605218533506777"
				data-ad-slot="1609368557"
			></ins>
		</div>
	{/if}
{/if}

<style>
	.ad {
		margin-inline: auto;
		margin-top: 20px;
		margin-bottom: 20px;
		width: 320px;
		max-width: 100%;
	}

	@media (min-width: 500px) {
		.ad {
			width: 468px;
		}
	}

	@media (min-width: 800px) {
		.ad {
			width: 728px;
		}
	}
</style>
