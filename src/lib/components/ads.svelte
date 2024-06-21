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

<div id="ad-container">
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-4605218533506777"
		data-ad-slot="7284584064"
		data-ad-format="rectangle"
		data-full-width-responsive="true"
	></ins>
</div>

<style lang="scss">
	#ad-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
