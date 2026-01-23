<script lang="ts">
	import { _ } from 'svelte-i18n';
	import TierRewardTrack from '$lib/components/TierRewardTrack.svelte';

	export let rewards: any[] = [];
	export let currentTier: number = 0;
	export let isPremium: boolean = false;
	export let claimableRewards: any[] = [];
	export let onClaimReward: (rewardId: number) => void;
</script>

<div class="mb-4 text-center">
	<h2 class="text-2xl font-bold">{$_('battlepass.tier_rewards')}</h2>
	<p class="text-muted-foreground">{$_('battlepass.tier_rewards_desc')}</p>
</div>

<TierRewardTrack
	{rewards}
	{currentTier}
	{isPremium}
	{claimableRewards}
	editable={false}
	{onClaimReward}
/>
