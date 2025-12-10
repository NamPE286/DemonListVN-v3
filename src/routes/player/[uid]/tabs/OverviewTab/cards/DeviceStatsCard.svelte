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
	let mobileRecords = $derived(allRecords.filter((r) => r.mobile).length);
	let pcRecords = $derived(allRecords.filter((r) => !r.mobile).length);
	let avgRefreshRate =
		$derived(allRecords.filter((r) => r.refreshRate).length > 0
			? Math.round(
					allRecords.filter((r) => r.refreshRate).reduce((acc, r) => acc + r.refreshRate, 0) /
						allRecords.filter((r) => r.refreshRate).length
				)
			: 0);
</script>

<BaseCard bind:draggedCard bind:cardConfigs {config} bind:isCustomizing>
	<Card.Root class="h-full" style={getBorderStyle(data.player)}>
		<Card.Header>
			<Card.Title class="text-lg">{$_('player.overview.device_stats')}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="device-stats">
				<div class="device-item">
					<div class="device-icon">💻</div>
					<div class="device-info">
						<div class="device-label">PC</div>
						<div class="device-value">{pcRecords}</div>
						<div class="device-percent">
							{allRecords.length > 0 ? Math.round((pcRecords / allRecords.length) * 100) : 0}%
						</div>
					</div>
				</div>
				<div class="device-item">
					<div class="device-icon">📱</div>
					<div class="device-info">
						<div class="device-label">Mobile</div>
						<div class="device-value">{mobileRecords}</div>
						<div class="device-percent">
							{allRecords.length > 0 ? Math.round((mobileRecords / allRecords.length) * 100) : 0}%
						</div>
					</div>
				</div>
			</div>
			{#if avgRefreshRate > 0}
				<div class="mt-3 text-center text-sm opacity-70">
					{$_('player.overview.avg_fps')}: {avgRefreshRate}fps
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</BaseCard>

<style lang="scss">
	.device-stats {
		display: flex;
		justify-content: space-around;
		gap: 20px;
	}

	.device-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		flex: 1;
	}

	.device-icon {
		font-size: 2.5rem;
	}

	.device-info {
		text-align: center;
	}

	.device-label {
		font-size: 0.9rem;
		opacity: 0.7;
		margin-bottom: 5px;
	}

	.device-value {
		font-size: 2rem;
		font-weight: bold;
	}

	.device-percent {
		font-size: 0.85rem;
		opacity: 0.6;
		margin-top: 2px;
	}

	@media screen and (max-width: 768px) {
		.device-icon {
			font-size: 2rem;
		}

		.device-value {
			font-size: 1.5rem;
		}
	}
</style>
