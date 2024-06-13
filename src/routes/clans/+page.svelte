<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Switch } from '$lib/components/ui/switch';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';
	import * as Tabs from "$lib/components/ui/tabs";

	const newClanData = {
		name: '',
		tag: '',
		isPublic: false
	};

	async function createClan() {
		if (
			!/^[a-zA-Z0-9]*$/gm.test(newClanData.tag) ||
			!(3 <= newClanData.tag.length && newClanData.tag.length <= 6)
		) {
			toast.error('Tag must be alphanumericm contains no space and must have 3-6 characters.');
			return;
		}

		if (!newClanData.name.length || !newClanData.tag.length) {
			toast.error('Please fill in all fields.');
			return;
		}

		toast.loading('Creating new clan...');

		fetch(`${import.meta.env.VITE_API_URL}/clan`, {
			method: 'POST',
			body: JSON.stringify(newClanData),
			headers: {
				Authorization: 'Bearer ' + (await $user.token()),
				'Content-Type': 'application/json'
			}
		}).then((res) => window.location.reload());
	}
</script>

<svelte:head>
	<title>Clans - Demon List VN</title>
</svelte:head>

<div class="titleWrapper">
	<Title value="Clans" />
	<Dialog.Root>
		{#if $user.loggedIn && !$user.data.clan}
			<Dialog.Trigger>
				<Button>Create clan</Button>
			</Dialog.Trigger>
		{/if}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Create new clan</Dialog.Title>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Name</Label>
					<Input class="col-span-3" bind:value={newClanData.name} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Tag</Label>
					<Input
						class="col-span-3"
						placeholder="3-6 characters, alphanumeric, no space"
						bind:value={newClanData.tag}
						maxlength={6}
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Public</Label>
					<Switch bind:checked={newClanData.isPublic} />
				</div>
			</div>
			<Dialog.Footer>
				<Button on:click={createClan}>Create</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

<style lang="scss">
	.titleWrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 100px;
	}

	.btn {
		display: flex;
		align-items: center !important;
	}
</style>
