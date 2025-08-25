<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';

	let invitePlayerUID = '';
	let inviteOpened = false;

	async function invitePlayer() {
		inviteOpened = false;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/clan/invite/${invitePlayerUID}`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			}),
			{
				success: () => {
					invitePlayerUID = '';
					return 'Player invited!';
				},
				loading: 'Sending invitation...',
				error: 'Failed to invite player.'
			}
		);
	}
</script>

<Dialog.Root bind:open={inviteOpened}>
	<Dialog.Trigger class="w-full">
		<Button variant="outline" class="w-full">Invite</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Invite new player</Dialog.Title>
		</Dialog.Header>
		<Input placeholder="Player's UID" bind:value={invitePlayerUID} />
		<Button on:click={invitePlayer} disabled={invitePlayerUID.length == 0}>Invite</Button>
	</Dialog.Content>
</Dialog.Root>
