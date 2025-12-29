<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import PostCard from '$lib/components/social/PostCard.svelte';
	import CommentsDialog from '$lib/components/social/CommentsDialog.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Post, Repost } from '$lib/client/social';
	import { getUserPosts, getUserReposts } from '$lib/client/social';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import * as Tabs from '$lib/components/ui/tabs';

	export let userId: string;

	let posts: Post[] = [];
	let reposts: Repost[] = [];
	let isLoadingPosts = true;
	let isLoadingReposts = true;
	let isLoadingMorePosts = false;
	let isLoadingMoreReposts = false;
	let hasMorePosts = true;
	let hasMoreReposts = true;

	let commentsOpen = false;
	let selectedPost: Post | null = null;

	onMount(() => {
		loadPosts();
		loadReposts();
	});

	async function loadPosts(reset = true) {
		if (reset) {
			posts = [];
			hasMorePosts = true;
		}
		if (!hasMorePosts) return;

		isLoadingPosts = reset;
		isLoadingMorePosts = !reset;

		try {
			const start = reset ? 0 : posts.length;
			const newPosts = await getUserPosts(userId, start, start + 20);
			if (newPosts.length < 20) {
				hasMorePosts = false;
			}
			posts = reset ? newPosts : [...posts, ...newPosts];
		} catch (error) {
			console.error('Failed to load posts:', error);
		}

		isLoadingPosts = false;
		isLoadingMorePosts = false;
	}

	async function loadReposts(reset = true) {
		if (reset) {
			reposts = [];
			hasMoreReposts = true;
		}
		if (!hasMoreReposts) return;

		isLoadingReposts = reset;
		isLoadingMoreReposts = !reset;

		try {
			const start = reset ? 0 : reposts.length;
			const newReposts = await getUserReposts(userId, start, start + 20);
			if (newReposts.length < 20) {
				hasMoreReposts = false;
			}
			reposts = reset ? newReposts : [...reposts, ...newReposts];
		} catch (error) {
			console.error('Failed to load reposts:', error);
		}

		isLoadingReposts = false;
		isLoadingMoreReposts = false;
	}

	function handlePostDeleted(event: CustomEvent<number>) {
		posts = posts.filter((p) => p.id !== event.detail);
	}

	function handleOpenComments(event: CustomEvent<Post>) {
		selectedPost = event.detail;
		commentsOpen = true;
	}
</script>

<CommentsDialog bind:open={commentsOpen} post={selectedPost} />

<div class="posts-tab">
	<Tabs.Root value="posts">
		<Tabs.List class="mb-4 w-full justify-center">
			<Tabs.Trigger value="posts" class="flex-1">{$_('social.posts')}</Tabs.Trigger>
			<Tabs.Trigger value="reposts" class="flex-1">{$_('social.reposts')}</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="posts">
			{#if isLoadingPosts}
				<div class="loading-state">
					<Loader2 class="h-8 w-8 animate-spin" />
					<p>{$_('social.loading')}</p>
				</div>
			{:else if posts.length === 0}
				<div class="empty-state">
					<p>{$_('social.no_posts')}</p>
				</div>
			{:else}
				<div class="posts-list">
					{#each posts as post (post.id)}
						<PostCard {post} on:deleted={handlePostDeleted} on:openComments={handleOpenComments} />
					{/each}
				</div>

				{#if hasMorePosts}
					<div class="load-more">
						<Button
							variant="outline"
							on:click={() => loadPosts(false)}
							disabled={isLoadingMorePosts}
						>
							{#if isLoadingMorePosts}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							{/if}
							{$_('social.load_more')}
						</Button>
					</div>
				{/if}
			{/if}
		</Tabs.Content>

		<Tabs.Content value="reposts">
			{#if isLoadingReposts}
				<div class="loading-state">
					<Loader2 class="h-8 w-8 animate-spin" />
					<p>{$_('social.loading')}</p>
				</div>
			{:else if reposts.length === 0}
				<div class="empty-state">
					<p>{$_('social.no_reposts')}</p>
				</div>
			{:else}
				<div class="posts-list">
					{#each reposts as repost (repost.id)}
						{#if repost.posts}
							<div class="repost-wrapper">
								<div class="repost-label">
									<span>{$_('social.reposted')}</span>
								</div>
								<PostCard
									post={repost.posts}
									on:deleted={handlePostDeleted}
									on:openComments={handleOpenComments}
								/>
							</div>
						{/if}
					{/each}
				</div>

				{#if hasMoreReposts}
					<div class="load-more">
						<Button
							variant="outline"
							on:click={() => loadReposts(false)}
							disabled={isLoadingMoreReposts}
						>
							{#if isLoadingMoreReposts}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							{/if}
							{$_('social.load_more')}
						</Button>
					</div>
				{/if}
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</div>

<style lang="scss">
	.posts-tab {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.repost-wrapper {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.repost-label {
		display: flex;
		align-items: center;
		gap: 6px;
		padding-left: 16px;
		color: var(--textColor2);
		font-size: 13px;
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px;
		color: var(--textColor2);
		gap: 12px;
	}

	.load-more {
		display: flex;
		justify-content: center;
		padding: 16px;
	}
</style>
