<script lang="ts">
	import type { PageData } from './$types';
	import PlayerMainPage from '../player/[uid]/mainPage.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

{#key data}
	<PlayerMainPage {data} />
{/key}
