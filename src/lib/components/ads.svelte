<script>
	import { onMount } from 'svelte';

	onMount(() => {
		try {
			let ins = document.createElement('ins');
			ins.className = 'adsbygoogle';
			ins.style.display = 'block';
			ins.setAttribute('data-ad-client', 'ca-pub-4605218533506777');
			ins.setAttribute('data-ad-slot', '7284584064');
			ins.setAttribute('data-ad-format', 'auto');
			ins.setAttribute('data-full-width-responsive', 'true');

			//@ts-ignore
			document.getElementById('ad-container').appendChild(ins);
			//@ts-ignore
			(adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.log('failed to load ads');
			console.error(err);
		}
	});
</script>

<div id="ad-container" />

<style lang="scss">
	#ad-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
