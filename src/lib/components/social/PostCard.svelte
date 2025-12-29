<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';
	import type { Post } from '$lib/client/social';
	import { likePost, unlikePost, repost, unrepost, deletePost } from '$lib/client/social';
	import Heart from 'lucide-svelte/icons/heart';
	import MessageCircle from 'lucide-svelte/icons/message-circle';
	import Repeat2 from 'lucide-svelte/icons/repeat-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import MoreHorizontal from 'lucide-svelte/icons/more-horizontal';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { createEventDispatcher } from 'svelte';

	export let post: Post;
	export let showActions = true;

	const dispatch = createEventDispatcher();

	let isLiked = post.isLiked ?? false;
	let isReposted = post.isReposted ?? false;
	let likeCount = post.postLikes?.[0]?.count ?? 0;
	let commentCount = post.postComments?.[0]?.count ?? 0;
	let repostCount = post.postReposts?.[0]?.count ?? 0;
	let isLiking = false;
	let isReposting = false;

	$: isOwner = $user.loggedIn && $user.data?.uid === post.authorId;
	$: canDelete = isOwner || $user.data?.isAdmin;

	function getTimeAgo(dateString: string): string {
		const now = new Date();
		const date = new Date(dateString);
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days}d`;
		if (hours > 0) return `${hours}h`;
		if (minutes > 0) return `${minutes}m`;
		return 'now';
	}

	async function handleLike() {
		if (!$user.loggedIn) {
			toast.error($_('social.login_required'));
			return;
		}
		if (isLiking) return;
		isLiking = true;
		try {
			if (isLiked) {
				await unlikePost(post.id);
				isLiked = false;
				likeCount--;
			} else {
				await likePost(post.id);
				isLiked = true;
				likeCount++;
			}
		} catch {
			toast.error($_('social.action_failed'));
		}
		isLiking = false;
	}

	async function handleRepost() {
		if (!$user.loggedIn) {
			toast.error($_('social.login_required'));
			return;
		}
		if (isReposting) return;
		isReposting = true;
		try {
			if (isReposted) {
				await unrepost(post.id);
				isReposted = false;
				repostCount--;
			} else {
				await repost(post.id);
				isReposted = true;
				repostCount++;
			}
		} catch {
			toast.error($_('social.action_failed'));
		}
		isReposting = false;
	}

	async function handleDelete() {
		if (!confirm($_('social.delete_confirm'))) return;
		try {
			await deletePost(post.id);
			toast.success($_('social.post_deleted'));
			dispatch('deleted', post.id);
		} catch {
			toast.error($_('social.action_failed'));
		}
	}

	function openComments() {
		dispatch('openComments', post);
	}

	function getAvatarUrl(player: Post['players']): string {
		return `https://cdn.demonlistvn.com/avatars/${player.uid}.jpg`;
	}
</script>

<div class="post-card">
	<div class="post-header">
		<a href={`/player/${post.players.uid}`} class="avatar-link">
			<Avatar.Root class="h-10 w-10">
				<Avatar.Image class="object-cover" src={getAvatarUrl(post.players)} alt="" />
				<Avatar.Fallback>{post.players.name[0]}</Avatar.Fallback>
			</Avatar.Root>
		</a>
		<div class="author-info">
			<a
				href={`/player/${post.players.uid}`}
				class="author-name"
				class:supporter={isActive(post.players.supporterUntil ?? null)}
			>
				{post.players.name}
			</a>
			<span class="post-time">· {getTimeAgo(post.created_at)}</span>
		</div>
		{#if canDelete}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon" class="ml-auto h-8 w-8">
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item on:click={handleDelete} class="text-red-500">
						<Trash2 class="mr-2 h-4 w-4" />
						{$_('general.delete')}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>

	<div class="post-content">
		<p class="whitespace-pre-wrap">{post.content}</p>
		{#if post.imageUrl}
			<div class="post-image">
				<img src={post.imageUrl} alt="Post attachment" />
			</div>
		{/if}
		{#if post.linkEmbed}
			<a href={post.linkEmbed} target="_blank" rel="noopener noreferrer" class="link-embed">
				{post.linkEmbed}
			</a>
		{/if}
	</div>

	{#if showActions}
		<div class="post-actions">
			<button class="action-btn" class:liked={isLiked} on:click={handleLike} disabled={isLiking}>
				<Heart class="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
				<span>{likeCount}</span>
			</button>
			<button class="action-btn" on:click={openComments}>
				<MessageCircle class="h-5 w-5" />
				<span>{commentCount}</span>
			</button>
			<button
				class="action-btn"
				class:reposted={isReposted}
				on:click={handleRepost}
				disabled={isReposting}
			>
				<Repeat2 class="h-5 w-5" />
				<span>{repostCount}</span>
			</button>
		</div>
	{/if}
</div>

<style lang="scss">
	.post-card {
		padding: 16px;
		border: 1px solid var(--border1);
		border-radius: 12px;
		background-color: var(--background);
		transition: background-color 0.2s;

		&:hover {
			background-color: var(--accent);
		}
	}

	.post-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.avatar-link {
		flex-shrink: 0;
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
	}

	.author-name {
		font-weight: 600;
		color: var(--textColor);
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:hover {
			text-decoration: underline;
		}

		&.supporter {
			color: #eab308;
		}
	}

	.post-time {
		color: var(--textColor2);
		font-size: 14px;
		flex-shrink: 0;
	}

	.post-content {
		margin-bottom: 12px;

		p {
			font-size: 15px;
			line-height: 1.5;
			color: var(--textColor);
		}
	}

	.post-image {
		margin-top: 12px;
		border-radius: 12px;
		overflow: hidden;

		img {
			width: 100%;
			max-height: 500px;
			object-fit: cover;
		}
	}

	.link-embed {
		display: block;
		margin-top: 12px;
		padding: 12px;
		border: 1px solid var(--border1);
		border-radius: 8px;
		color: var(--primary);
		font-size: 14px;
		text-decoration: none;
		word-break: break-all;

		&:hover {
			background-color: var(--accent);
		}
	}

	.post-actions {
		display: flex;
		gap: 24px;
		padding-top: 8px;
		border-top: 1px solid var(--border1);
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border: none;
		background: transparent;
		color: var(--textColor2);
		font-size: 14px;
		cursor: pointer;
		border-radius: 9999px;
		transition: all 0.2s;

		&:hover {
			background-color: var(--accent);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&.liked {
			color: #ef4444;
		}

		&.reposted {
			color: #22c55e;
		}
	}
</style>
