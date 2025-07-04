<script lang="ts">
	import type { PageData } from './$types';
	import SvelteMarkdown from 'svelte-markdown';
	import { onMount } from 'svelte';
	import { user } from '$lib/client';
	import EventBanner from '../eventBanner.svelte';
	import ParticipateButton from './participateButton.svelte';

	export let data: PageData;
	
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
	<ParticipateButton {data} />
	<div class="content markdown">
		{#if data.content}
			<SvelteMarkdown source={data.content} />
		{/if}
	</div>
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
