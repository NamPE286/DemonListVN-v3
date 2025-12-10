<script lang="ts">
	import BaseCard from './BaseCard.svelte';
	import * as Card from '$lib/components/ui/card';
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
	let flRecords = $derived(data.records.fl || []);
	let plRecords = $derived(data.records.pl || []);
	let allRecords = $derived([...dlRecords, ...flRecords, ...plRecords]);
</script>

<BaseCard bind:draggedCard bind:cardConfigs {config} bind:isCustomizing>
	<Card.Root class="h-full" style={getBorderStyle(data.player)}>
		<Card.Header>
			<Card.Title class="text-lg">{$_('player.overview.total_records')}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="stat-value">{allRecords.length}</div>
			<div class="stat-breakdown">
				<div class="stat-item">
					<span class="stat-label">Classic</span>
					<span class="stat-number">{dlRecords.length}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Featured</span>
					<span class="stat-number">{flRecords.length}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Platformer</span>
					<span class="stat-number">{plRecords.length}</span>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</BaseCard>

<style lang="scss">
	.stat-value {
		font-size: 3rem;
		font-weight: bold;
		text-align: center;
		margin-bottom: 10px;
	}

	.stat-breakdown {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 15px;
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 8px;
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.stat-number {
		font-weight: 600;
		font-size: 1.1rem;
	}

	@media screen and (max-width: 768px) {
		.stat-value {
			font-size: 2.5rem;
		}
	}
</style>
