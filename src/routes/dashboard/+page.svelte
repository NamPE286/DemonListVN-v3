<script lang="ts">
	import Dashboard from '$lib/components/dashboard.svelte';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let events: any = null;

	async function getEvents() {
		return await (await fetch(`${import.meta.env.VITE_API_URL}/events/ongoing`)).json();
	}

	$: if (browser && $user.checked) {
		if (!$user.loggedIn || !isActive($user.data?.supporterUntil)) {
			goto('/');
		}
	}

	onMount(async () => {
        events = await getEvents();
    });
</script>

<svelte:head>
	<title>Dashboard - Demon List VN</title>
</svelte:head>

<Dashboard {events} />
