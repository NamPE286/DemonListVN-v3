<script>
	import { onMount } from 'svelte';

	export let dataAdFormat = 'auto';

	onMount(() => {
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.log('failed to load ads');
			console.error(err);
		}
	});
</script>

<div id="ad-container" class="mb-[20px] ml-auto mr-auto mt-[20px] w-full max-w-[800px]">
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-4605218533506777"
		data-ad-slot="7284584064"
		data-ad-format={dataAdFormat}
		data-full-width-responsive="true"
	></ins>
</div>
