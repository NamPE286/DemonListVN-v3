<script lang="ts">
	import supabase from '$lib/client/supabase';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Pencil1 from 'svelte-radix/Pencil1.svelte';
	import imageCompression from 'browser-image-compression';
	import { user } from '$lib/client';

	function getImage(e: any) {
		let image = e.target.files[0];
		const options = {
			maxSizeMB: 0.035,
			maxWidthOrHeight: 480,
			useWebWorker: true
		};

		imageCompression(image, options).then(async (cImg) => {
			var { data, error } = await supabase.storage
				.from('avatars')
				.upload(`/${$user.data.uid}.jpg`, cImg, {
					cacheControl: '0',
					upsert: true
				});

			if (error) {
			} else {
				window.location.reload();
			}
		});
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}><Pencil1 /></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
</style>
