<script lang="ts">
	import { onMount } from 'svelte';
	import LevelCard from './levelCard.svelte';
	import type { Level } from './type';
	import { user } from '$lib/client';

	export let levels: Level[];
	export let event: any;
	let records: any[] = new Array(5).fill(null);

	async function fetchRecord() {
		if (!$user.loggedIn) {
			return;
		}

		records = await (
			await fetch(`${import.meta.env.VITE_API_URL}/event/8/submissions`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			})
		).json();
	}

	onMount(async () => {
		await fetchRecord();

		user.subscribe((value) => {
			fetchRecord();
		});
	});
</script>

{#key records}
	{#each levels as level, index}
		<LevelCard {level} {index} {records} {event} />
	{/each}
{/key}
