<script lang="ts">
	import Heatmap from '$lib/components/heatmap.svelte';
	import BaseCard from './BaseCard.svelte';
	import type { CardConfig } from './types';

	interface Props {
		data: any;
		cardConfigs: CardConfig[];
		config: CardConfig;
		draggedCard: string | null;
		isCustomizing?: boolean;
	}

	let {
		data,
		cardConfigs = $bindable(),
		config,
		draggedCard = $bindable(),
		isCustomizing = $bindable(false)
	}: Props = $props();
</script>

<BaseCard bind:draggedCard bind:cardConfigs {config} bind:isCustomizing>
	<div class="flex justify-center">
		{#key data.player.uid}
			<Heatmap uid={data.player.uid} />
		{/key}
	</div>
</BaseCard>
