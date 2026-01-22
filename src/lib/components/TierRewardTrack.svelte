<script lang="ts">
	import Crown from 'lucide-svelte/icons/crown';
	import Gift from 'lucide-svelte/icons/gift';
	import Lock from 'lucide-svelte/icons/lock';
	import Check from 'lucide-svelte/icons/check';
	import Plus from 'lucide-svelte/icons/plus';
	import { MAX_TIER } from '$lib/battlepass/constants';

	export let rewards: any[] = [];
	export let currentTier: number = 0;
	export let isPremium: boolean = false;
	export let claimableRewards: any[] = [];
	export let editable: boolean = false;
	export let onRewardClick: ((reward: any) => void) | null = null;
	export let onAddRewardClick: ((tier: number, isPremium: boolean) => void) | null = null;
	export let onClaimReward: ((rewardId: number) => void) | null = null;

	function getTierRewards(tier: number) {
		return rewards.filter((r: any) => r.tier === tier);
	}

	function getFreeRewards(tierRewards: any[]) {
		return tierRewards.filter((r: any) => !r.isPremium);
	}

	function getPremiumRewards(tierRewards: any[]) {
		return tierRewards.filter((r: any) => r.isPremium);
	}

	function isTierUnlocked(tier: number) {
		return currentTier >= tier;
	}

	function isRewardClaimable(reward: any) {
		return reward && claimableRewards.some((r) => r.id === reward.id);
	}
</script>

<div class="tier-track-container overflow-x-auto pb-4">
	<div class="flex flex-col gap-2 px-4" style="min-width: max-content;">
		<!-- Premium Rewards Row -->
		<div class="flex gap-4">
			{#each Array(MAX_TIER) as _, i}
				{@const tier = i + 1}
				{@const tierRewards = getTierRewards(tier)}
				{@const premiumRewards = getPremiumRewards(tierRewards)}
				{@const isUnlocked = isTierUnlocked(tier)}
				<div class="flex w-20 flex-col items-center gap-1">
					{#each premiumRewards as premiumReward}
						<button
							class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all"
							class:border-yellow-500={editable || (isUnlocked && isPremium)}
							class:bg-yellow-500-10={editable || (isUnlocked && isPremium)}
							class:border-yellow-500-30={!editable && (!isUnlocked || !isPremium)}
							class:bg-yellow-500-5={!editable && (!isUnlocked || !isPremium)}
							class:opacity-50={!editable && (!isUnlocked || !isPremium)}
							class:hover:scale-105={editable || isRewardClaimable(premiumReward)}
							class:hover:bg-yellow-500-20={editable}
							class:reward-claimable={!editable && isRewardClaimable(premiumReward)}
							on:click={() => {
								if (editable && onRewardClick) {
									onRewardClick(premiumReward);
								} else if (!editable && isRewardClaimable(premiumReward) && onClaimReward) {
									onClaimReward(premiumReward.id);
								}
							}}
							disabled={!editable && !isRewardClaimable(premiumReward)}
						>
							<Crown class="absolute -right-1 -top-1 h-5 w-5 text-yellow-500" />
							{#if premiumReward.quantity > 1}
								<span
									class="quantity-badge absolute bottom-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-xs font-bold text-black"
								>
									{premiumReward.quantity}
								</span>
							{/if}
							{#if !editable && !isUnlocked}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50"
								>
									<Lock class="h-6 w-6 text-muted-foreground" />
								</div>
							{:else if !editable && isRewardClaimable(premiumReward)}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500/20"
								>
									<Gift class="h-8 w-8 text-green-400" />
								</div>
							{/if}
							<div class="flex items-center justify-center p-2">
								{#if premiumReward.items?.id || premiumReward.itemId}
									<img
										class="h-12 w-12 object-contain"
										src={`https://cdn.demonlistvn.com/items/${premiumReward.items?.id || premiumReward.itemId}.webp`}
										alt={premiumReward.description}
									/>
								{:else}
									<Gift class="h-8 w-8" />
								{/if}
							</div>
						</button>
					{/each}
					{#if editable && onAddRewardClick}
						<!-- Add Premium Reward Button -->
						<button
							class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 border-yellow-500-30 bg-yellow-500-5 transition-all hover:scale-105 hover:bg-yellow-500-10"
							on:click={() => onAddRewardClick?.(tier, true)}
						>
							<Crown class="absolute -right-1 -top-1 h-5 w-5 text-yellow-500" />
							<Plus class="h-8 w-8 text-yellow-500/50" />
						</button>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Tier Numbers Row -->
		<div class="flex gap-4">
			{#each Array(MAX_TIER) as _, i}
				{@const tier = i + 1}
				{@const isUnlocked = isTierUnlocked(tier)}
				<div class="flex w-20 items-center justify-center">
					<div
						class="tier-number flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all {isUnlocked
							? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black'
							: 'bg-muted text-muted-foreground'}"
					>
						{tier}
					</div>
				</div>
			{/each}
		</div>

		<!-- Free Rewards Row -->
		<div class="flex gap-4">
			{#each Array(MAX_TIER) as _, i}
				{@const tier = i + 1}
				{@const tierRewards = getTierRewards(tier)}
				{@const freeRewards = getFreeRewards(tierRewards)}
				{@const isUnlocked = isTierUnlocked(tier)}
				<div class="flex w-20 flex-col items-center gap-1">
					{#each freeRewards as freeReward}
						<button
							class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all"
							class:border-blue-500={editable || isUnlocked}
							class:bg-blue-500-10={editable || isUnlocked}
							class:border-muted={!editable && !isUnlocked}
							class:bg-muted-30={!editable && !isUnlocked}
							class:opacity-50={!editable && !isUnlocked}
							class:hover:scale-105={editable || isRewardClaimable(freeReward)}
							class:hover:bg-blue-500-20={editable}
							class:reward-claimable={!editable && isRewardClaimable(freeReward)}
							on:click={() => {
								if (editable && onRewardClick) {
									onRewardClick(freeReward);
								} else if (!editable && isRewardClaimable(freeReward) && onClaimReward) {
									onClaimReward(freeReward.id);
								}
							}}
							disabled={!editable && !isRewardClaimable(freeReward)}
						>
							{#if freeReward.quantity > 1}
								<span
									class="quantity-badge absolute bottom-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-bold text-white"
								>
									{freeReward.quantity}
								</span>
							{/if}
							{#if !editable && !isUnlocked}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50"
								>
									<Lock class="h-6 w-6 text-muted-foreground" />
								</div>
							{:else if !editable && isRewardClaimable(freeReward)}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500/20"
								>
									<Gift class="h-8 w-8 text-green-400" />
								</div>
							{/if}
							<div class="flex items-center justify-center p-2">
								{#if freeReward.items?.id || freeReward.itemId}
									<img
										class="h-12 w-12 object-contain"
										src={`https://cdn.demonlistvn.com/items/${freeReward.items?.id || freeReward.itemId}.webp`}
										alt={freeReward.description}
									/>
								{:else}
									<Gift class="h-8 w-8" />
								{/if}
							</div>
						</button>
					{/each}
					{#if editable && onAddRewardClick}
						<!-- Add Free Reward Button -->
						<button
							class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 border-muted bg-muted/30 transition-all hover:scale-105 hover:bg-muted/50"
							on:click={() => onAddRewardClick?.(tier, false)}
						>
							<Plus class="h-8 w-8 text-muted-foreground/50" />
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.tier-track-container {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--muted)) transparent;
	}

	.tier-track-container::-webkit-scrollbar {
		height: 8px;
	}

	.tier-track-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.tier-track-container::-webkit-scrollbar-thumb {
		background-color: hsl(var(--muted));
		border-radius: 4px;
	}

	.reward-claimable {
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background-color: rgba(34, 197, 94, 0.3) !important;
		}
	}

	.quantity-badge {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* Custom background color classes with opacity */
	:global(.bg-yellow-500-5) {
		background-color: rgb(234 179 8 / 0.05);
	}

	:global(.bg-yellow-500-10) {
		background-color: rgb(234 179 8 / 0.1);
	}

	:global(.bg-yellow-500-20) {
		background-color: rgb(234 179 8 / 0.2);
	}

	:global(.border-yellow-500-30) {
		border-color: rgb(234 179 8 / 0.3);
	}

	:global(.bg-blue-500-10) {
		background-color: rgb(59 130 246 / 0.1);
	}

	:global(.bg-blue-500-20) {
		background-color: rgb(59 130 246 / 0.2);
	}

	:global(.bg-muted-30) {
		background-color: hsl(var(--muted) / 0.3);
	}
</style>
