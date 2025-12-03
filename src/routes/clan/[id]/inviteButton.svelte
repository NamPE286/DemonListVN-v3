<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';
	import { _ } from 'svelte-i18n';

	let invitePlayerUID = '';
	let opened = false;

	async function invitePlayer() {
		opened = false;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/clans/invite/${invitePlayerUID}`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			}),
			{
				success: () => {
					invitePlayerUID = '';
					return $_('toast.clan_invite.success');
				},
				loading: $_('toast.clan_invite.loading'),
				error: $_('toast.clan_invite.error')
			}
		);
	}
</script>

<Dialog.Root bind:open={opened}>
	<Dialog.Trigger class="w-full">
		<Button variant="outline" class="w-full">Invite</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('invite.title')}</Dialog.Title>
		</Dialog.Header>
		<Input placeholder={$_('invite.placeholder')} bind:value={invitePlayerUID} />
		<Button on:click={invitePlayer} disabled={invitePlayerUID.length == 0}>{$_('invite.button')}</Button>
	</Dialog.Content>
</Dialog.Root>
