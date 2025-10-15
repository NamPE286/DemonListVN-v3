<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from './eventCard.svelte';

	export let data: any;

	onMount(() => {
		console.log(data);
	});
</script>

{#each data.events as event}
	<EventCard {event} />
{/each}
