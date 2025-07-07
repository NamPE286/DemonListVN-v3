<script lang="ts">
	import { onMount } from 'svelte';
	import LevelCard from './levelCard.svelte';
	import type { Level } from './type';
	import { user } from '$lib/client';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { ExclamationTriangle } from 'svelte-radix';

	export let levels: (Level | null)[];
	export let event: any;
	let records: any[] = new Array(5).fill(null);

	async function fetchRecord() {
		if (!$user.loggedIn) {
			return;
		}

		records = await (
			await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/submissions`, {
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

<div class="ml-auto mr-auto flex w-[1000px] max-w-full flex-col gap-[10px]">
	{#if $user.loggedIn && !$user.data.discord}
		<Alert.Root class="text-yellow-400">
			<Alert.Title class="flex items-center gap-[10px]">
				<ExclamationTriangle size={15} />
				You need to link your account to a Discord account in order to submit. Go to {'Settings > Discord'}
				to link.</Alert.Title
			>
		</Alert.Root>
	{/if}

	{#key records}
		{#each levels as level, index}
			<LevelCard {level} {index} {records} {event} />
		{/each}
	{/key}
</div>
