<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from './eventCard.svelte';
	import FilterCard from './filterCard.svelte';

	export let data: any;

	interface Filter {
		search: string;
		eventType: 'all' | 'contest' | 'nonContest';
		contestType: 'all' | 'ranked' | 'unranked';
		start: string;
		end: string;
	}

	let filter: Filter = {
		search: '',
		eventType: 'all',
		contestType: 'all',
		start: '',
		end: ''
	};

	function handleFilterApply(event: CustomEvent<Filter>) {
		filter = event.detail;
		console.log('Applying filter to fetch data from API:', filter);
	}

	onMount(() => {
		console.log(data);
	});
</script>

<div class="mx-auto mt-[20px] w-full max-w-[1500px] px-1">
	<div class="flex flex-col gap-[10px] lg:hidden">
		<FilterCard 
			bind:filter 
			on:filterApply={handleFilterApply}
		/>
		<div class="grid grid-cols-1 gap-[10px] md:grid-cols-2">
			{#each data.events as event}
				<EventCard {event} />
			{/each}
		</div>
	</div>
	<div class="hidden lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
        <div class="sticky top-[75px] h-fit">
            <FilterCard 
				bind:filter 
				on:filterApply={handleFilterApply}
			/>
        </div>
		<div class="grid grid-cols-1 gap-[10px] xl:grid-cols-2">
			{#each data.events as event}
				<EventCard {event} />
			{/each}
		</div>
	</div>
</div>
