<script lang="ts">
	import Heatmap from '$lib/components/heatmap.svelte';
	import BaseCard from './BaseCard.svelte';
	import type { CardConfig } from './types';

	export let data: any;
	export let cardConfigs: CardConfig[];
	export let config: CardConfig;
	export let draggedCard: string | null;
	export let isCustomizing: boolean = false;
</script>

<BaseCard bind:draggedCard bind:cardConfigs bind:config bind:isCustomizing>
	<div class="flex justify-center">
		{#key data.player.uid}
			<Heatmap uid={data.player.uid} />
		{/key}
	</div>
</BaseCard>
