<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { user } from '$lib/client';
	import EventBanner from '../../eventBanner.svelte';
	import Markdown from '$lib/components/markdown.svelte';
	import { onMount } from 'svelte';
	import type { Level } from '../type';
	import SingleElimBracket from './singleElimBracket.svelte';

	export let data: PageData;

	let levels: (Level | null)[] = [];
	let tab = 'detail';

	onMount(async () => {
		levels = await (await fetch(`${import.meta.env.VITE_API_URL}/event/${data.id}/levels`)).json();
	});
</script>

<svelte:head>
	<title>{data.title} - Demon List VN</title>
</svelte:head>

{#if tab == 'detail'}
	<EventBanner {data} />
{/if}

{#if !data.hidden || ($user.loggedIn && $user.data.isAdmin)}
	<Tabs.Root bind:value={tab} class="mt-[20px] flex flex-col items-center">
		<Tabs.List>
			<Tabs.Trigger value="detail">Detail</Tabs.Trigger>
			<Tabs.Trigger value="standing">Standing</Tabs.Trigger>
			<Tabs.Trigger value="schedule">Schedule</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="detail">
			<div class="markdown">
				{#if data.content}
					<Markdown content={data.content} />
				{/if}
			</div>
		</Tabs.Content>
		<Tabs.Content value="standing" class="h-[100vh] w-full mt-[20px]">
            <SingleElimBracket {data} />
        </Tabs.Content>
		<Tabs.Content value="schedule" class="h-[100vh] w-full">
			<iframe
				src={data.data.calendar}
				style="border: 0"
				width="100%"
				height="85%"
				frameborder="0"
				scrolling="no"
				title="schedule"
			/>
		</Tabs.Content>
	</Tabs.Root>
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
