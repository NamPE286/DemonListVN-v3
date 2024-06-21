<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';

	import BigTitle from '$lib/components/bigTitle.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Ads from '$lib/components/ads.svelte';

	let curTab = $page.url.pathname.split('/').at(-1) == 'leaderboard' ? 'leaderboard' : 'levels';

	function update() {
		curTab = $page.url.pathname.split('/').at(-1) == 'leaderboard' ? 'leaderboard' : 'levels';
	}

	$: $page.url, update();
</script>

<svelte:head>
	<title
		>Leaderboard - {$page.params.list == 'dl' ? 'Demon' : 'Featured'} List - Demon List VN</title
	>
</svelte:head>

{#if $page.params.list == 'dl'}
	<BigTitle value="Demon List" description="Hardest level beaten by Vietnamese" />
{:else if $page.params.list == 'fl'}
	<BigTitle value="Featured List" description="Hardest level created by Vietnamese" />
{/if}

<Ads />

<Tabs.Root bind:value={curTab} class="tabs">
	<div class="tabsWrapper">
		<Tabs.List>
			<Tabs.Trigger
				value="levels"
				on:click={() => {
					goto(`/list/${$page.params.list}`);
				}}>Levels</Tabs.Trigger
			>
			<Tabs.Trigger
				value="leaderboard"
				on:click={() => {
					goto(`/list/${$page.params.list}/leaderboard`);
				}}>Leaderboard</Tabs.Trigger
			>
		</Tabs.List>
	</div>
</Tabs.Root>

<slot />

<style lang="scss">
	.tabsWrapper {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 25px;
	}
</style>
