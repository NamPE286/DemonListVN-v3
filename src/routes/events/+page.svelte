<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any[];

	onMount(() => {
		console.log(data);
	});
</script>
