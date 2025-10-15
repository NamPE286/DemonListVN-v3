<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from './eventCard.svelte';
	import FilterCard from './filterCard.svelte';

	export let data: any;

	onMount(() => {
		console.log(data);
	});
</script>

<div class="mx-auto mt-[20px] w-full max-w-[1500px] px-1">
	<div class="flex flex-col gap-[10px] lg:hidden">
		<FilterCard />
		<div class="grid grid-cols-1 gap-[10px] md:grid-cols-2">
			{#each data.events as event}
				<EventCard {event} />
			{/each}
		</div>
	</div>
	<div class="hidden lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
		<div class="sticky top-4 h-fit">
			<FilterCard />
		</div>
		<div class="grid grid-cols-1 gap-[10px] xl:grid-cols-2">
			{#each data.events as event}
				<EventCard {event} />
			{/each}
		</div>
	</div>
</div>
