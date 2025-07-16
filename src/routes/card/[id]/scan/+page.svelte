<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { PageData } from '../$types';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { user } from '$lib/client';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { toast } from 'svelte-sonner';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let data: PageData;

	let loaded = false;

	async function link() {
		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/card/${data.id}/link`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			}),
			{
				success: () => {
					window.location.reload();
					return 'Linked!';
				},
				error: 'Failed to link',
				loading: 'Linking...'
			}
		);
	}

	onMount(() => {
		loaded = true;
	});
</script>

<div
	class="slide-up ml-auto mr-auto mt-[10px] flex w-[500px] max-w-full flex-col items-center gap-[10px] pl-[5px] pr-[5px]"
	class:loaded
>
	<img class="rounded-xl border border-gray-500 shadow-md" src={data.img} alt="card" />
	<p class="text-[12px] opacity-50">ID: {data.id}</p>
	<h3 class="text-xl font-bold">{data.name} Card</h3>
	<div>
		{#if data.activationDate == null}
			<div class="text-center">
				<p>This card is not activated.</p>
				<p>Please contact with a moderator to activate this card.</p>
			</div>
		{:else if data.owner == null}
			{#if $user.loggedIn}
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button class="w-full">Link card to {$user.data.name}</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Link card to this account ({$user.data.name})?</AlertDialog.Title>
							<AlertDialog.Description>
								This will permanently link the card to this account ({$user.data.name}) and cannot
								be unlinked or transfered.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action on:click={link}>Continue</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			{:else}
				<Skeleton class="h-[35px] w-[150px]" />
			{/if}
		{:else if data.owner}
			<div class="flex gap-[10px]" >
				Owner: <PlayerHoverCard player={data.players} />
			</div>
		{/if}
	</div>
</div>

<style>
	.slide-up {
		transform: translateY(50px);
		opacity: 0;
		transition:
			transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			opacity 0.6s ease-out;
	}

	.slide-up.loaded {
		transform: translateY(0);
		opacity: 1;
	}

	.slide-down {
		transform: translateY(-30px);
		opacity: 0;
		transition:
			transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			opacity 0.6s ease-out;
		transition-delay: 0.6s; /* Delay to run after slide-up animation */
	}

	.loaded .slide-down {
		transform: translateY(0);
		opacity: 1;
	}
</style>
