<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { user } from '$lib/client';
	import EventBanner from '../eventBanner.svelte';
	import Markdown from '$lib/components/markdown.svelte';
	import LevelTab from './levelTab.svelte';
	import Leaderboard from './leaderboard.svelte';

	import type { Level } from './type';

	export let data: PageData;

	const levels: Level[] = [
		{
			id: 121184864,
			name: 'NEW WORLD',
			creator: 'Tinraz',
			videoID: 'VqOx2DhUXNA',
			point: 100,
			needRaw: false
		},
		{
			id: 120313852,
			name: 'Infernal Aether',
			creator: 'GamerKnight750',
			videoID: 'H0quPVhforY',
			point: 100,
			needRaw: false
		},
		{
			id: 120866069,
			name: 'big feet',
			creator: 'AudieoVisual',
			videoID: '2zFz8LASf_s',
			point: 100,
			needRaw: false
		},
		{
			id: 120552432,
			name: 'Free Geomrtyr Dash',
			creator: 'ParzivalGames',
			videoID: '6XbAoByMFwU',
			point: 200,
			needRaw: false
		},
		{
			id: 121537017,
			name: 'Virtual Human',
			creator: 'Creator',
			videoID: 'gK7uFHZAOz4',
			point: 200,
			needRaw: false
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
