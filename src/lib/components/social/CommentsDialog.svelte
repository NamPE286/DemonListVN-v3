<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';
	import type { Post, Comment } from '$lib/client/social';
	import { getPostComments, createComment, deleteComment } from '$lib/client/social';
	import PostCard from './PostCard.svelte';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import { onMount } from 'svelte';

	export let open = false;
	export let post: Post | null = null;

	let comments: Comment[] = [];
	let newComment = '';
	let isLoading = false;
	let isSubmitting = false;

	$: if (open && post) {
		loadComments();
	}

	async function loadComments() {
		if (!post) return;
		isLoading = true;
		try {
			comments = await getPostComments(post.id);
		} catch {
			toast.error($_('social.load_comments_failed'));
		}
		isLoading = false;
	}

	async function handleSubmitComment() {
		if (!post || !newComment.trim() || isSubmitting) return;
		isSubmitting = true;
		try {
			const comment = await createComment(post.id, newComment.trim());
			comments = [comment, ...comments];
			newComment = '';
		} catch {
			toast.error($_('social.comment_failed'));
		}
		isSubmitting = false;
	}

	async function handleDeleteComment(commentId: number) {
		if (!confirm($_('social.delete_comment_confirm'))) return;
		try {
			await deleteComment(commentId);
			comments = comments.filter((c) => c.id !== commentId);
			toast.success($_('social.comment_deleted'));
		} catch {
			toast.error($_('social.action_failed'));
		}
	}

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

	function getAvatarUrl(player: Comment['players']): string {
		const isSupporter = isActive(player.supporterUntil ?? null);
		const extension = isSupporter && player.isAvatarGif ? '.gif' : '.jpg';
		const version = player.avatarVersion ? `?version=${player.avatarVersion}` : '';
		return `https://cdn.demonlistvn.com/avatars/${player.uid}${extension}${version}`;
	}

	function canDeleteComment(comment: Comment): boolean {
		return $user.loggedIn && ($user.data.uid === comment.authorId || $user.data.isAdmin);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[85vh] max-w-2xl overflow-hidden">
		<Dialog.Header>
			<Dialog.Title>{$_('social.comments')}</Dialog.Title>
		</Dialog.Header>

		<div class="comments-container">
			{#if post}
				<div class="post-preview">
					<PostCard {post} showActions={false} />
				</div>
			{/if}

			{#if $user.loggedIn}
				<div class="comment-input">
					<Avatar.Root class="h-8 w-8">
						<Avatar.Image
							class="object-cover"
							src={`https://cdn.demonlistvn.com/avatars/${$user.data.uid}${
								isActive($user.data.supporterUntil) && $user.data.isAvatarGif ? '.gif' : '.jpg'
							}`}
							alt=""
						/>
						<Avatar.Fallback>{$user.data.name[0]}</Avatar.Fallback>
					</Avatar.Root>
					<Textarea
						bind:value={newComment}
						placeholder={$_('social.write_comment')}
						class="min-h-[60px] flex-1 resize-none"
					/>
					<Button
						on:click={handleSubmitComment}
						disabled={!newComment.trim() || isSubmitting}
						size="sm"
					>
						{isSubmitting ? $_('social.posting') : $_('social.reply')}
					</Button>
				</div>
			{/if}

			<div class="comments-list">
				{#if isLoading}
					<div class="loading">{$_('social.loading')}</div>
				{:else if comments.length === 0}
					<div class="no-comments">{$_('social.no_comments')}</div>
				{:else}
					{#each comments as comment (comment.id)}
						<div class="comment">
							<a href={`/player/${comment.players.uid}`}>
								<Avatar.Root class="h-8 w-8">
									<Avatar.Image
										class="object-cover"
										src={getAvatarUrl(comment.players)}
										alt=""
									/>
									<Avatar.Fallback>{comment.players.name[0]}</Avatar.Fallback>
								</Avatar.Root>
							</a>
							<div class="comment-content">
								<div class="comment-header">
									<a href={`/player/${comment.players.uid}`} class="comment-author">
										{comment.players.name}
									</a>
									<span class="comment-time">{getTimeAgo(comment.created_at)}</span>
									{#if canDeleteComment(comment)}
										<button
											class="delete-btn"
											on:click={() => handleDeleteComment(comment.id)}
										>
											<Trash2 class="h-3 w-3" />
										</button>
									{/if}
								</div>
								<p class="comment-text">{comment.content}</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.comments-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-height: 60vh;
		overflow-y: auto;
	}

	.post-preview {
		border-bottom: 1px solid var(--border1);
		padding-bottom: 16px;
	}

	.comment-input {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid var(--border1);
	}

	.comments-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.comment {
		display: flex;
		gap: 12px;
	}

	.comment-content {
		flex: 1;
		min-width: 0;
	}

	.comment-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
	}

	.comment-author {
		font-weight: 600;
		color: var(--textColor);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.comment-time {
		color: var(--textColor2);
		font-size: 12px;
	}

	.comment-text {
		font-size: 14px;
		line-height: 1.4;
		color: var(--textColor);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.delete-btn {
		margin-left: auto;
		padding: 4px;
		border: none;
		background: transparent;
		color: var(--textColor2);
		cursor: pointer;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			color: #ef4444;
			background-color: var(--accent);
		}
	}

	.loading,
	.no-comments {
		text-align: center;
		color: var(--textColor2);
		padding: 24px;
	}
</style>
