<script>
	import { onMount } from 'svelte';

	export let dataAdFormat = 'auto';
	let mounted = false;

	onMount(() => {
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

<div class="mb-[20px] mt-[20px] w-full max-w-[100%] text-center">
	<ins
		class="adsbygoogle ad"
		style="display:block"
		data-ad-client="ca-pub-4605218533506777"
		data-ad-slot="7284584064"
		data-ad-format={dataAdFormat}
		data-full-width-responsive="true"
	></ins>
</div>

<style>
	.ad {
		margin-inline: auto;
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
