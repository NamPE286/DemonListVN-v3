<script lang="ts">
	import PlayerMainPage from '../player/[uid]/mainPage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<PlayerMainPage {data} />
