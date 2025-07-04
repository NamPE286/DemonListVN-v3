<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { user } from '$lib/client';
	import EventBanner from '../eventBanner.svelte';
	import Markdown from '$lib/components/markdown.svelte';
	import LevelCard from './levelCard.svelte';
	import type { Level } from './type';

	export let data: PageData;

	const levels: Level[] = [
		{
			id: 123,
			name: 'Level A',
			creator: 'Creator',
			videoID: '7Dj2_NQB7Jw',
			point: 100,
			needRaw: false
		},
		{
			id: 234,
			name: 'Level B',
			creator: 'Creator',
			videoID: 'VPhLXeU25KA',
			point: 200,
			needRaw: false
		},
		{
			id: 345,
			name: 'Level C',
			creator: 'Creator',
			videoID: 'T4bkikW7fUE',
			point: 300,
			needRaw: false
		},
		{
			id: 456,
			name: 'Level D',
			creator: 'Creator',
			videoID: 'evtoG-4dLM4',
			point: 400,
			needRaw: true
		},
		{
			id: 567,
			name: 'Level E',
			creator: 'Creator',
			videoID: 'H_Nc-zjRmK4',
			point: 500,
			needRaw: true
		}
	];

	function isEventStarted() {
		return new Date(data.start) <= new Date();
	}
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
			{#each levels as level}
				<LevelCard {level} />
			{/each}
		</Tabs.Content>
		<Tabs.Content value="leaderboard" class="mt-[20px] w-full pl-[10px] pr-[10px] flex flex-col items-center">
			Leaderboard
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
