<script lang="ts">
	import { page } from '$app/state';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	let data: any = null;

	onMount(async () => {
		data = await fetch(`${import.meta.env.VITE_API_URL}/coupon/${page.params.code}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + (await $user.token())
			}
		});
	});
</script>

<div class="flex items-center" style="height: calc(100vh - 150px)">
	<Card.Root class="mx-auto w-[1000px]">
		<Card.Content class="pt-[50px]">
			<p>Card Content</p>
		</Card.Content>
	</Card.Root>
</div>
