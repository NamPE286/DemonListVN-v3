<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';
	import { page } from '$app/stores';

	const token = $page.url.searchParams.get('token');

	async function link() {
		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/auth/link/discord`, {
				method: 'PATCH',
				body: JSON.stringify({
					token: token
				}),
				headers: {
					Authorization: 'Bearer ' + (await $user.token())!,
					'Content-Type': 'application/json'
				}
			}),
			{
				loading: 'Linking your Discord account',
				success: () => {
					window.location.href = '/';
					return 'Linked!';
				},
				error: 'Failed to link'
			}
		);
	}
	$: $user.loggedIn && link();
</script>
