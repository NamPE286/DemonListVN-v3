<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from './eventCard.svelte';

	export let data: any;

	onMount(() => {
		console.log(data);
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-[10px] w-full max-w-7xl mx-auto px-4">
	{#each data.events as event}
		<EventCard {event} />
	{/each}
</div>
