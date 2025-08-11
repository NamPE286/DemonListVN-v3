<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { user } from '$lib/client';
	import EventBanner from '../eventBanner.svelte';
	import Markdown from '$lib/components/markdown.svelte';
	import LevelTab from './levelTab.svelte';
	import Leaderboard from './leaderboard.svelte';
	import { onMount } from 'svelte';
	import ParticipateButton from './participateButton.svelte';
	import type { Level } from './type';

	export let data: PageData;

	let levels: (Level | null)[] = [];

	onMount(async () => {
		levels = await (await fetch(`${import.meta.env.VITE_API_URL}/event/${data.id}/levels`)).json();
	});
</script>

<svelte:head>
	<title>{data.title} - Demon List VN</title>
	<meta property="og:title" content={`${data.title} - Demon List VN`} />
	<meta property="og:description" content={data.description} />
	<meta property="og:image" content={data.imgUrl} />
</svelte:head>

<EventBanner {data} />

{#if !data.hidden || ($user.loggedIn && $user.data.isAdmin)}
	{#if data.isContest}
		<Tabs.Root value="detail" class="mt-[20px] flex flex-col items-center">
			<Tabs.List>
				<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
				<Tabs.Trigger value="levels">Levels</Tabs.Trigger>
				<Tabs.Trigger value="leaderboard">Leaderboard</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="detail">
				<div class="markdown">
					{#if data.content}
						<Markdown content={data.content} />
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content value="levels" class="mt-[20px] w-full pl-[10px] pr-[10px]">
				<LevelTab {levels} event={data} />
			</Tabs.Content>
			<Tabs.Content value="leaderboard" class="mt-[20px] w-full pl-[10px] pr-[10px]">
				{#if levels.length}
					<Leaderboard {levels} event={data} />
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<ParticipateButton {data} />
		<div class="markdown">
			{#if data.content}
				<Markdown content={data.content} />
			{/if}
		</div>
	{/if}
{/if}

<style lang="scss">
	.markdown {
		width: 1000px;
		margin-inline: auto;
		max-width: 100%;
		padding-inline: 10px;
	}

	@media screen and (max-width: 1000px) {
		.markdown {
			width: 100%;
		}
	}
</style>
