<script lang="ts">
	import { onMount } from 'svelte';
	import Medal from '../medal.svelte';

	interface Props {
		userID: string;
	}

	let { userID }: Props = $props();

	let medals: any[] = $state([]);

	onMount(async () => {
		medals = await (await fetch(`${import.meta.env.VITE_API_URL}/players/${userID}/medals`)).json();
	});
</script>

<div class="flex flex-wrap justify-center">
	{#each medals as medal}
		<Medal {medal} />
	{/each}
</div>
