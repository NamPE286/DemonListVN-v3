<script>
	import { onMount } from 'svelte';

	export let dataAdFormat = 'auto';
	const enabled = false;
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
	});
</script>

{#if enabled}
	<div class="text-center">
		<ins
			class="adsbygoogle ad"
			style="display:block"
			data-ad-client="ca-pub-4605218533506777"
			data-ad-slot="7284584064"
			data-ad-format={dataAdFormat}
			data-full-width-responsive="true"
		></ins>
	</div>
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
