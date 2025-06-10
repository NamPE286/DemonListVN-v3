<script lang="ts">
	import supabase from '$lib/client/supabase';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Pencil1 from 'svelte-radix/Pencil1.svelte';
	import imageCompression from 'browser-image-compression';
	import { user } from '$lib/client';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { isSupporterActive } from '$lib/client/isSupporterActive';
	import { Badge } from '$lib/components/ui/badge';

	export let data: any;
	export let open = false;

	let player = structuredClone(data);
	let fileinput: any;
	let fileinput1: any;
	let provinces: any = {};
	let provinceItem = {
		disabled: false,
		label: player.province,
		value: player.province
	};
	let cityItem = {
		disabled: false,
		label: player.city,
		value: player.city
	};

	$: open, reset();

	function reset() {
		player = structuredClone(data);
	}

	async function getAvatar(e: any) {
		if (player.isBanned) {
			return;
		}

		let image = e.target.files[0];

		if (image.name.endsWith('.gif')) {
			const upload = new Promise((resolve, reject) => {
				supabase.storage
					.from('avatars')
					.upload(`/${$user.data.uid}.gif`, image, {
						cacheControl: '86400',
						upsert: true
					})
					.then(async (res) => {
						player.isAvatarGif = true;
						player.avatarVersion++;

						await fetch(`${import.meta.env.VITE_API_URL}/player`, {
							method: 'PUT',
							headers: {
								Authorization: 'Bearer ' + (await $user.token()),
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(player)
						});

						const { data, error } = res;

						if (error) {
							reject();
						} else {
							resolve({});
						}
					});
			});

			toast.promise(upload, {
				loading: 'Uploading...',
				success: 'Uploaded! It may take a while to take effect.	',
				error: 'Upload failed.'
			});
		} else {
			const options = {
				maxSizeMB: 0.035,
				maxWidthOrHeight: 480,
				useWebWorker: true
			};

			const cImg = await imageCompression(image, options);
			const upload = new Promise((resolve, reject) => {
				supabase.storage
					.from('avatars')
					.upload(`/${$user.data.uid}.jpg`, cImg, {
						cacheControl: '86400',
						upsert: true
					})
					.then(async (res) => {
						player.isAvatarGif = false;
						player.avatarVersion++;

						await fetch(`${import.meta.env.VITE_API_URL}/player`, {
							method: 'PUT',
							headers: {
								Authorization: 'Bearer ' + (await $user.token()),
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(player)
						});

						const { data, error } = res;

						if (error) {
							reject();
						} else {
							resolve({});
						}
					});
			});

			toast.promise(upload, {
				loading: 'Uploading...',
				success: 'Uploaded! It may take a while to take effect.	',
				error: 'Upload failed.'
			});
		}
	}

	async function getBanner(e: any) {
		if (player.isBanned) {
			return;
		}

		let image = e.target.files[0];

		if (image.name.endsWith('.gif')) {
			const upload = new Promise((resolve, reject) => {
				supabase.storage
					.from('banners')
					.upload(`/${$user.data.uid}.gif`, image, {
						cacheControl: '86400',
						upsert: true
					})
					.then(async (res) => {
						player.isBannerGif = true;
						player.bannerVersion++;

						await fetch(`${import.meta.env.VITE_API_URL}/player`, {
							method: 'PUT',
							headers: {
								Authorization: 'Bearer ' + (await $user.token()),
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(player)
						});

						const { data, error } = res;

						if (error) {
							console.error(error);
							reject();
						} else {
							resolve({});
						}
					});
			});

			toast.promise(upload, {
				loading: 'Uploading...',
				success: 'Uploaded! It may take a while to take effect.	',
				error: 'Upload failed.'
			});
		} else {
			const options = {
				maxSizeMB: 4.5,
				maxWidthOrHeight: 1920,
				useWebWorker: true
			};

			const cImg = await imageCompression(image, options);
			const upload = new Promise((resolve, reject) => {
				supabase.storage
					.from('banners')
					.upload(`/${$user.data.uid}.jpg`, cImg, {
						cacheControl: '86400',
						upsert: true
					})
					.then(async (res) => {
						player.isBannerGif = false;
						player.bannerVersion++;

						await fetch(`${import.meta.env.VITE_API_URL}/player`, {
							method: 'PUT',
							headers: {
								Authorization: 'Bearer ' + (await $user.token()),
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(player)
						});

						const { data, error } = res;

						if (error) {
							console.error(error);
							reject();
						} else {
							resolve({});
						}
					});
			});

			toast.promise(upload, {
				loading: 'Uploading...',
				success: 'Uploaded! It may take a while to take effect.	',
				error: 'Upload failed.'
			});
		}
	}

	async function saveChanges() {
		player.province = provinceItem.value;
		player.city = cityItem.value;

		if (!/^[A-Za-z0-9]+$/.test(player.name)) {
			toast.error('Name must contain only letters and numbers.');
			return;
		}

		const token = await $user.token();
		const promise = fetch(`${import.meta.env.VITE_API_URL}/player`, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(player)
		});

		toast.promise(promise, {
			loading: 'Saving...',
			success: 'Saved!',
			error: 'Failed to save.'
		});

		data = player;
		open = false;
	}

	onMount(() => {
		fetch(`${import.meta.env.VITE_API_URL}/provinces`)
			.then((res) => res.json())
			.then((res) => {
				provinces = res;
			});
	});
</script>

<input
	style="display:none"
	type="file"
	accept={isSupporterActive($user.data.supporterUntil) ? '.jpg, .jpeg, .gif' : '.jpg, .jpeg'}
	on:change={(e) => getAvatar(e)}
	bind:this={fileinput}
/>

<input
	style="display:none"
	type="file"
	accept={'.jpg, .jpeg, .gif'}
	on:change={(e) => getBanner(e)}
	bind:this={fileinput1}
/>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}><Pencil1 /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input
						id="name"
						bind:value={player.name}
						class="col-span-3"
						disabled={player.isTrusted && !player.isAdmin}
					/>
				</div>
				<div class="flex gap-[10px]">
					<Button
						class="w-full"
						variant="outline"
						id="avatar"
						placeholder="Avatar"
						on:click={() => {
							fileinput.click();
						}}>Upload avatar</Button
					>
					<Button
						class="w-full"
						variant="outline"
						id="avatar"
						placeholder="Avatar"
						disabled={!isSupporterActive(player.supporterUntil)}
						on:click={() => {
							fileinput1.click();
						}}>Upload banner</Button
					>
				</div>
				{#if isSupporterActive(player.supporterUntil)}
					<div class="mb-[10px] flex items-center gap-[10px] text-sm">
						Border
						<Input type="color" bind:value={player.borderColor} />
						Background
						<Input type="color" bind:value={player.bgColor} />
						<Button
							variant="outline"
							on:click={() => {
								player.borderColor = player.bgColor = null;
							}}>Reset</Button
						>
					</div>
				{/if}
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="youtube" class="text-right">YouTube</Label>
					<Input id="youtube" bind:value={player.youtube} class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="facebook" class="text-right">Facebook</Label>
					<Input id="facebook" bind:value={player.facebook} class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="province" class="text-right">Province</Label>
					<Select.Root bind:selected={provinceItem}>
						<Select.Trigger class="col-span-3">
							<Select.Value placeholder="Province" />
						</Select.Trigger>
						<Select.Content>
							<ScrollArea class="h-72">
								{#each Object.keys(provinces)
									.map((key) => provinces[key])
									.sort((a, b) => {
										return a.name > b.name ? 1 : -1;
									}) as province}
									<Select.Item
										value={province.name}
										on:click={() => {
											cityItem.value = cityItem.label = null;
										}}>{province.name}</Select.Item
									>
								{/each}
							</ScrollArea>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="province" class="text-right">City</Label>
					<Select.Root bind:selected={cityItem} disabled={provinceItem.value == null}>
						<Select.Trigger class="col-span-3">
							<Select.Value placeholder="City" />
						</Select.Trigger>
						<Select.Content>
							<ScrollArea class="h-72">
								{#each provinces[provinceItem.value].cities as city}
									<Select.Item value={city}>{city}</Select.Item>
								{/each}
							</ScrollArea>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="airplane-mode" class="text-right">Hide profile</Label>
					<Switch id="airplane-mode" class="col-span-3" bind:checked={player.isHidden} />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit" on:click={saveChanges}>Save changes</Button>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
</style>
