<script lang="ts">
	import { user } from '$lib/client';
	import { _ } from 'svelte-i18n';
	import * as Tabs from '$lib/components/ui/tabs';
	import PostComposer from '$lib/components/social/PostComposer.svelte';
	import PostCard from '$lib/components/social/PostCard.svelte';
	import CommentsDialog from '$lib/components/social/CommentsDialog.svelte';
	import type { Post } from '$lib/client/social';
	import { getFeed, getFollowingFeed } from '$lib/client/social';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import Loader2 from 'lucide-svelte/icons/loader-2';

	let posts: Post[] = [];
	let isLoading = true;
	let isLoadingMore = false;
	let activeTab = 'for-you';
	let hasMore = true;

	let commentsOpen = false;
	let selectedPost: Post | null = null;

	$: if (activeTab) {
		loadPosts(true);
	}

	onMount(() => {
		loadPosts(true);
	});

	async function loadPosts(reset = false) {
		if (reset) {
			posts = [];
			hasMore = true;
		}
		if (!hasMore) return;

		isLoading = reset;
		isLoadingMore = !reset && posts.length > 0;

		try {
			const start = reset ? 0 : posts.length;
			const end = start + 20;
			let newPosts: Post[];

			if (activeTab === 'following' && $user.loggedIn) {
				newPosts = await getFollowingFeed(start, end);
			} else {
				newPosts = await getFeed(start, end);
			}

			if (newPosts.length < 20) {
				hasMore = false;
			}

			posts = reset ? newPosts : [...posts, ...newPosts];
		} catch (error) {
			console.error('Failed to load posts:', error);
		}

		isLoading = false;
		isLoadingMore = false;
	}

	function handlePostCreated(event: CustomEvent<Post>) {
		posts = [event.detail, ...posts];
	}

	function handlePostDeleted(event: CustomEvent<number>) {
		posts = posts.filter((p) => p.id !== event.detail);
	}

	function handleOpenComments(event: CustomEvent<Post>) {
		selectedPost = event.detail;
		commentsOpen = true;
	}

	function loadMore() {
		if (!isLoadingMore && hasMore) {
			loadPosts(false);
		}
	}
</script>

<svelte:head>
	<title>{$_('social.title')} - Demon List VN</title>
</svelte:head>

<CommentsDialog bind:open={commentsOpen} post={selectedPost} />

<div class="social-page">
	<div class="feed-container">
		<h1 class="page-title">{$_('social.title')}</h1>

		<Tabs.Root bind:value={activeTab}>
			<Tabs.List class="mb-4 w-full justify-center">
				<Tabs.Trigger value="for-you" class="flex-1">{$_('social.for_you')}</Tabs.Trigger>
				{#if $user.loggedIn}
					<Tabs.Trigger value="following" class="flex-1">{$_('social.following_tab')}</Tabs.Trigger>
				{/if}
			</Tabs.List>

			<Tabs.Content value="for-you">
				<div class="feed-content">
					<PostComposer on:created={handlePostCreated} />

					{#if isLoading}
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
								<PostCard
									{post}
									on:deleted={handlePostDeleted}
									on:openComments={handleOpenComments}
								/>
							{/each}
						</div>

						{#if hasMore}
							<div class="load-more">
								<Button variant="outline" on:click={loadMore} disabled={isLoadingMore}>
									{#if isLoadingMore}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									{/if}
									{$_('social.load_more')}
								</Button>
							</div>
						{/if}
					{/if}
				</div>
			</Tabs.Content>

			{#if $user.loggedIn}
				<Tabs.Content value="following">
					<div class="feed-content">
						<PostComposer on:created={handlePostCreated} />

						{#if isLoading}
							<div class="loading-state">
								<Loader2 class="h-8 w-8 animate-spin" />
								<p>{$_('social.loading')}</p>
							</div>
						{:else if posts.length === 0}
							<div class="empty-state">
								<p>{$_('social.no_following_posts')}</p>
							</div>
						{:else}
							<div class="posts-list">
								{#each posts as post (post.id)}
									<PostCard
										{post}
										on:deleted={handlePostDeleted}
										on:openComments={handleOpenComments}
									/>
								{/each}
							</div>

							{#if hasMore}
								<div class="load-more">
									<Button variant="outline" on:click={loadMore} disabled={isLoadingMore}>
										{#if isLoadingMore}
											<Loader2 class="mr-2 h-4 w-4 animate-spin" />
										{/if}
										{$_('social.load_more')}
									</Button>
								</div>
							{/if}
						{/if}
					</div>
				</Tabs.Content>
			{/if}
		</Tabs.Root>
	</div>
</div>

<style lang="scss">
	.social-page {
		min-height: 100vh;
		padding: 20px;
	}

	.feed-container {
		max-width: 600px;
		margin: 0 auto;
	}

	.page-title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 20px;
		text-align: center;
	}

	.feed-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
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

	@media screen and (max-width: 768px) {
		.social-page {
			padding: 10px;
		}

		.page-title {
			font-size: 20px;
		}
	}
</style>
