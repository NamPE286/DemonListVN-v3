<script>
	import { onMount } from 'svelte';
	import { mediaQuery } from 'svelte-legos';

	let isDesktop = true;

	onMount(() => {
		if (mediaQuery('(min-width: 1200px)')) {
			isDesktop = true;
		}

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
	{#if isDesktop}
		<ins
			class="adsbygoogle"
			style="display:inline-block;width:728px;height:90px"
			data-ad-client="ca-pub-4605218533506777"
			data-ad-slot="7284584064"
		></ins>
	{:else}
		<ins
			class="adsbygoogle"
			style="display:inline-block;width:320px;height:100px"
			data-ad-client="ca-pub-4605218533506777"
			data-ad-slot="8384269781"
		></ins>
	{/if}
</div>

<style lang="scss">
	#ad-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}
</style>
