<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { user } from '$lib/client';
	import EventBanner from '../eventBanner.svelte';
	import Markdown from '$lib/components/markdown.svelte';
	import LevelTab from './levelTab.svelte';
	import Leaderboard from './leaderboard.svelte';
	import { onMount } from 'svelte';
	import type { Level } from './type';

	export let data: PageData;

	let levels: Level[] = [];

	function isEventStarted() {
		return new Date(data.start) <= new Date();
	}

	onMount(async () => {
		levels = await (await fetch(`${import.meta.env.VITE_API_URL}/event/8/levels`)).json();
	});
</script>

<svelte:head>
	<title>{data.title} - Demon List VN</title>
</svelte:head>

<EventBanner {data} />

{#if isEventStarted() || ($user.loggedIn && $user.data.isAdmin)}
	<Tabs.Root value="detail" class="mt-[20px] flex flex-col items-center">
		<Tabs.List>
			<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
			<Tabs.Trigger value="levels">Levels</Tabs.Trigger>
			<Tabs.Trigger value="leaderboard">Leaderboard</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="detail">
			<div class="content markdown">
				{#if data.content}
					<Markdown content={data.content} />
				{/if}
			</div>
		</Tabs.Content>
		<Tabs.Content value="levels" class="mt-[20px] w-full pl-[10px] pr-[10px]">
			<LevelTab {levels} event={data} />
		</Tabs.Content>
		<Tabs.Content value="leaderboard" class="mt-[20px] w-full pl-[10px] pr-[10px]">
			<Leaderboard {levels} event={data} />
		</Tabs.Content>
	</Tabs.Root>
{/if}

<style lang="scss">
	.content {
		padding-inline: 200px;
	}

	@media screen and (max-width: 900px) {
		.content {
			padding-inline: 10px;
		}
	}
</style>
