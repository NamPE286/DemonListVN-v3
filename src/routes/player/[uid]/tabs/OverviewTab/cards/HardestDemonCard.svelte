<script lang="ts">
	import BaseCard from './BaseCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import LevelCard from '$lib/components/levelCard.svelte';
	import { _ } from 'svelte-i18n';
	import { isActive } from '$lib/client/isSupporterActive';
	import type { CardConfig } from './types';
	import { getBorderStyle } from './getBorderStyle';

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

	let dlRecords = $derived(data.records.dl || []);
	let hardestLevel = $derived(dlRecords.length > 0 ? dlRecords[0] : null);
</script>

<BaseCard bind:draggedCard bind:cardConfigs {config} bind:isCustomizing>
	<Card.Root class="h-full" style={getBorderStyle(data.player)}>
		<Card.Header>
			<Card.Title class="text-lg">{$_('player.overview.hardest_demon')}</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if hardestLevel}
				<LevelCard level={hardestLevel.levels} type="dl" />
			{:else}
				<div class="no-records">{$_('player.overview.no_data')}</div>
			{/if}
		</Card.Content>
	</Card.Root>
</BaseCard>

<style lang="scss">
	.no-records {
		text-align: center;
		padding: 20px;
		opacity: 0.6;
	}
</style>
