<script>
	import { onMount } from 'svelte';

	onMount(() => {
		try {
			window.addEventListener('load', () => {
				// @ts-ignore
				(adsbygoogle = window.adsbygoogle || []).push({});
			});
		} catch (err) {
			console.log('failed to load ads');
			console.error(err);
		}
	});
</script>

<style lang="scss">
	#ad-container {
		width: fit-content;
		margin-inline: auto;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	@media screen and (min-width: 1200px) {
		.mobile {
			display: none;
		}
	}

	@media screen and (max-width: 1200px) {
		.desktop {
			display: none;
		}
	}
</style>

<div id="ad-container">
	<div class="desktop">
		<ins
			class="adsbygoogle"
			style="display:inline-block;width:728px;height:90px"
			data-ad-client="ca-pub-4605218533506777"
			data-ad-slot="7284584064"
		></ins>
	</div>
	<div class="mobile">
		<ins
			class="adsbygoogle"
			style="display:inline-block;width:320px;height:100px"
			data-ad-client="ca-pub-4605218533506777"
			data-ad-slot="8384269781"
		></ins>
	</div>
</div>
