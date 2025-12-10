<script lang="ts">
	import type { PageData } from './$types';
	import PlayerMainPage from './mainPage.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

{#key data}
	<PlayerMainPage {data} />
{/key}
