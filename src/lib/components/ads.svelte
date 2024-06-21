<script>
	import { onMount } from 'svelte';

	export let dataAdFormat = 'auto';
	let mounted = false

	onMount(() => {
		console.log(mounted)
		mounted = true
		try {
			// @ts-ignore
			(adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.log('failed to load ads');
			console.error(err);
		}
	});
</script>

<div id="ad-container" class="mb-[20px] mt-[20px] w-full text-center">
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-4605218533506777"
		data-ad-slot="7284584064"
		data-ad-format={dataAdFormat}
		data-full-width-responsive="true"
	></ins>
</div>
