<script lang="ts">
	import type { PageData } from './$types';
	import SvelteMarkdown from 'svelte-markdown';
	import * as Tabs from '$lib/components/ui/tabs';
	import { onMount } from 'svelte';
	import { user } from '$lib/client';
	import ParticipateButton from './participateButton.svelte';
	import EventBanner from '../eventBanner.svelte';
	import type { Level } from './type';

	export let data: PageData;

	const levels: Level[] = [
		{
			id: 123,
			name: 'Level A',
			videoID: '',
			point: 100,
			needRaw: false
		},
		{
			id: 456,
			name: 'Level B',
			videoID: '',
			point: 200,
			needRaw: true
		}
	];

	function isEventStarted() {
		return new Date(data.start) <= new Date();
	}

	onMount(() => {
		const elem = document.getElementsByClassName('markdown')[0];

		if (elem) {
			const links = elem.getElementsByTagName('a');
			for (const link of links) {
				link.style.color = '#98c2fe';
			}
		}
	});
</script>

<svelte:head>
	<title>{data.title} - Demon List VN</title>
</svelte:head>

<EventBanner {data} />

{#if isEventStarted() || ($user.loggedIn && $user.data.isAdmin)}
	<ParticipateButton {data} {levels} />
	<Tabs.Root value="detail" class="flex flex-col items-center">
		<Tabs.List>
			<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
			<Tabs.Trigger value="levels">Levels</Tabs.Trigger>
			<Tabs.Trigger value="leaderboard">Leaderboard</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="detail">
			<div class="content markdown">
				{#if data.content}
					<SvelteMarkdown source={data.content} />
				{/if}
			</div>
		</Tabs.Content>
		<Tabs.Content value="levels">Levels</Tabs.Content>
		<Tabs.Content value="leaderboard">Leaderboard</Tabs.Content>
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
