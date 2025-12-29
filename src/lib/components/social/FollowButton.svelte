<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';
	import { followUser, unfollowUser, isFollowing as checkIsFollowing } from '$lib/client/social';
	import { onMount } from 'svelte';

	export let userId: string;
	export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';

	let isFollowing = false;
	let isLoading = true;
	let isUpdating = false;

	$: isSelf = $user.loggedIn && $user.data?.uid === userId;

	onMount(async () => {
		if ($user.loggedIn && !isSelf) {
			try {
				const result = await checkIsFollowing($user.data.uid, userId);
				isFollowing = result.isFollowing;
			} catch {
				// Ignore errors
			}
		}
		isLoading = false;
	});

	async function handleFollow() {
		if (!$user.loggedIn) {
			toast.error($_('social.login_required'));
			return;
		}
		if (isSelf || isUpdating) return;

		isUpdating = true;
		try {
			if (isFollowing) {
				await unfollowUser(userId);
				isFollowing = false;
				toast.success($_('social.unfollowed'));
			} else {
				await followUser(userId);
				isFollowing = true;
				toast.success($_('social.followed'));
			}
		} catch {
			toast.error($_('social.action_failed'));
		}
		isUpdating = false;
	}
</script>

{#if !isSelf}
	<Button
		variant={isFollowing ? 'outline' : 'default'}
		{size}
		on:click={handleFollow}
		disabled={isLoading || isUpdating}
	>
		{#if isLoading}
			...
		{:else if isFollowing}
			{$_('social.following')}
		{:else}
			{$_('social.follow')}
		{/if}
	</Button>
{/if}
