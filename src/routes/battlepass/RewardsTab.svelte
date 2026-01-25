<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import TierRewardTrack from '$lib/components/TierRewardTrack.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { XP_PER_TIER, MAX_TIER } from '$lib/battlepass/constants';

	let rewards: any[] = [];
	let claimableRewards: any[] = [];
	let currentTier: number = 0;
	let isPremium: boolean = false;
	let loading = true;
	let mounted = false;

	async function fetchRewards() {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/rewards`);
			if (res.ok) {
				rewards = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch rewards:', e);
		}
	}

	async function fetchProgress() {
		if (!$user.loggedIn) return;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/progress`, {
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

			if (res.ok) {
				const progress = await res.json();
				currentTier = Math.min(Math.floor(progress.xp / XP_PER_TIER), MAX_TIER);
				isPremium = progress.isPremium ?? false;
			}
		} catch (e) {
			console.error('Failed to fetch progress:', e);
		}
	}

	async function fetchClaimableRewards() {
		if (!$user.loggedIn) return;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/rewards/claimable`, {
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			});

			if (res.ok) {
				claimableRewards = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch claimable rewards:', e);
		}
	}

	async function claimReward(rewardId: number) {
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/battlepass/reward/${rewardId}/claim`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${await $user.token()}`
					}
				}
			);

			if (res.ok) {
				toast.success($_('battlepass.reward_claimed'));
				await fetchClaimableRewards();
				await fetchProgress();
			} else {
				const error = await res.text();
				toast.error(error || $_('battlepass.claim_failed'));
			}
		} catch (e) {
			toast.error($_('battlepass.claim_failed'));
		}
	}

	async function loadData() {
		loading = true;
		await Promise.all([
			fetchRewards(),
			fetchProgress(),
			fetchClaimableRewards()
		]);
		loading = false;
	}

	onMount(() => {
	 	mounted = true;
	 	loadData();

		const unsubscribe = user.subscribe(async (value) => {
			if (!mounted) return;

			if (value.loggedIn) {
				await Promise.all([fetchProgress(), fetchClaimableRewards()]);
			} else {
				currentTier = 0;
				isPremium = false;
				claimableRewards = [];
			}
		});

		return () => {
			mounted = false;
			unsubscribe();
		};
	});
</script>

<div class="mb-4 text-center">
	<h2 class="text-2xl font-bold">{$_('battlepass.tier_rewards')}</h2>
	<p class="text-muted-foreground">{$_('battlepass.tier_rewards_desc')}</p>
</div>

{#if loading}
	<div class="flex flex-col gap-4">
		<Skeleton class="h-24 w-full" />
		<Skeleton class="h-24 w-full" />
	</div>
{:else}
	<TierRewardTrack
		{rewards}
		{currentTier}
		{isPremium}
		{claimableRewards}
		editable={false}
		onClaimReward={claimReward}
	/>
{/if}
