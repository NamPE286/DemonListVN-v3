<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from './eventCard.svelte';
	import FilterCard from './filterCard.svelte';

	export let data: any;

	onMount(() => {
		console.log(data);
	});
</script>

<div class="mx-auto flex w-full max-w-7xl flex-col gap-[10px] mt-[20px] px-1">
	<FilterCard />
	<div class="grid grid-cols-1 gap-[10px] md:grid-cols-2">
		{#each data.events as event}
			<EventCard {event} />
		{/each}
	</div>
</div>
