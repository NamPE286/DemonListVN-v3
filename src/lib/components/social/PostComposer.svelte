<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import * as Avatar from '$lib/components/ui/avatar';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';
	import { createPost } from '$lib/client/social';
	import Image from 'lucide-svelte/icons/image';
	import Link from 'lucide-svelte/icons/link';
	import X from 'lucide-svelte/icons/x';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let content = '';
	let imageUrl = '';
	let linkEmbed = '';
	let showImageInput = false;
	let showLinkInput = false;
	let isSubmitting = false;

	$: canSubmit = content.trim().length > 0 && !isSubmitting;

	function getAvatarUrl(): string {
		if (!$user.loggedIn) return '';
		return `https://cdn.demonlistvn.com/avatars/${$user.data.uid}${
			isActive($user.data.supporterUntil) && $user.data.isAvatarGif ? '.gif' : '.jpg'
		}?version=${$user.data.avatarVersion}`;
	}

	async function handleSubmit() {
		if (!canSubmit) return;
		isSubmitting = true;

		try {
			const newPost = await createPost({
				content: content.trim(),
				imageUrl: imageUrl.trim() || undefined,
				linkEmbed: linkEmbed.trim() || undefined
			});
			toast.success($_('social.post_created'));
			content = '';
			imageUrl = '';
			linkEmbed = '';
			showImageInput = false;
			showLinkInput = false;
			dispatch('created', newPost);
		} catch {
			toast.error($_('social.create_failed'));
		}

		isSubmitting = false;
	}

	function toggleImageInput() {
		showImageInput = !showImageInput;
		if (!showImageInput) imageUrl = '';
	}

	function toggleLinkInput() {
		showLinkInput = !showLinkInput;
		if (!showLinkInput) linkEmbed = '';
	}
</script>

{#if $user.loggedIn}
	<div class="composer">
		<div class="composer-header">
			<a href={`/player/${$user.data.uid}`}>
				<Avatar.Root class="h-10 w-10">
					<Avatar.Image class="object-cover" src={getAvatarUrl()} alt="" />
					<Avatar.Fallback>{$user.data.name[0]}</Avatar.Fallback>
				</Avatar.Root>
			</a>
			<div class="composer-input">
				<Textarea
					bind:value={content}
					placeholder={$_('social.whats_happening')}
					class="min-h-[80px] resize-none border-0 bg-transparent text-base focus-visible:ring-0"
				/>
			</div>
		</div>

		{#if showImageInput}
			<div class="attachment-input">
				<Input
					bind:value={imageUrl}
					placeholder={$_('social.image_url_placeholder')}
					class="flex-1"
				/>
				<Button variant="ghost" size="icon" on:click={toggleImageInput}>
					<X class="h-4 w-4" />
				</Button>
			</div>
		{/if}

		{#if showLinkInput}
			<div class="attachment-input">
				<Input
					bind:value={linkEmbed}
					placeholder={$_('social.link_url_placeholder')}
					class="flex-1"
				/>
				<Button variant="ghost" size="icon" on:click={toggleLinkInput}>
					<X class="h-4 w-4" />
				</Button>
			</div>
		{/if}

		<div class="composer-footer">
			<div class="composer-actions">
				<Button
					variant="ghost"
					size="icon"
					on:click={toggleImageInput}
					class={showImageInput ? 'text-primary' : ''}
				>
					<Image class="h-5 w-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					on:click={toggleLinkInput}
					class={showLinkInput ? 'text-primary' : ''}
				>
					<Link class="h-5 w-5" />
				</Button>
			</div>
			<Button on:click={handleSubmit} disabled={!canSubmit}>
				{isSubmitting ? $_('social.posting') : $_('social.post')}
			</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	.composer {
		padding: 16px;
		border: 1px solid var(--border1);
		border-radius: 12px;
		background-color: var(--background);
	}

	.composer-header {
		display: flex;
		gap: 12px;
	}

	.composer-input {
		flex: 1;
	}

	.attachment-input {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		padding-left: 52px;
	}

	.composer-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--border1);
	}

	.composer-actions {
		display: flex;
		gap: 4px;
	}
</style>
