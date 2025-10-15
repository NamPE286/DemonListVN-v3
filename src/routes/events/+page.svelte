<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';
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

	async function fetchData() {
		// @ts-ignore
		const query = new URLSearchParams({ ...filter, from: 0, to: 49 }).toString();
		const res = await (await fetch(`${import.meta.env.VITE_API_URL}/events?${query}`)).json();

		data.events = res;
		data = data;
	}

	function handleFilterApply(event: CustomEvent<Filter>) {
		filter = event.detail;
		toast.promise(fetchData, {
			success: $_('toast.filter.success'),
			loading: $_('toast.filter.loading'),
			error: $_('toast.filter.error')
		});
	}
</script>

<svelte:head>
	<title>Sự kiện - Demon List VN</title>
</svelte:head>

<div class="mx-auto mt-[20px] w-full max-w-[1500px] px-1">
	<div class="flex flex-col gap-[10px] lg:hidden">
		<FilterCard bind:filter on:filterApply={handleFilterApply} />
		<div class="grid grid-cols-1 gap-[10px] md:grid-cols-2">
			{#each data.events as event}
				<EventCard {event} />
			{/each}
		</div>
	</div>
	<div class="hidden lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
		<div class="sticky top-[75px] h-fit">
			<FilterCard bind:filter on:filterApply={handleFilterApply} />
		</div>
		<div class="grid grid-cols-1 gap-[10px] xl:grid-cols-2">
			{#each data.events as event}
				<EventCard {event} />
			{/each}
		</div>
	</div>
</div>
