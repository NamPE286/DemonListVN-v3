<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { user } from '$lib/client';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';

	async function copyToken() {
		await navigator.clipboard.writeText((await $user.token())!);
		toast('Copied to clipboard!');
	}

	async function refresh() {
		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/refresh`, {
				method: 'PATCH',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			}),
			{
				success: 'Refreshed!',
				loading: 'Refreshing...',
				error: 'Failed to refresh.'
			}
		);
	}
</script>

<svelte:head></svelte:head>

{#if $user.loggedIn && $user.data.isAdmin}
	<Title value="Admin" />

	<div class="wrapper">
		<Button on:click={refresh}>Refresh</Button><br />
		<a href="/admin/ratingEstimator">Rating estimator</a><br />
		<a href="/admin/submission">Submission</a><br />
		<a href="/admin/level">Level manager</a><br />
		<a href="/admin/accountMerger">Account merger</a><br />
		<Button on:click={copyToken}>Copy token</Button>
	</div>
{/if}

<style lang="scss">
	a {
		color: #7cb4f8;
	}

	.wrapper {
		padding-inline: 75px;
	}
</style>
