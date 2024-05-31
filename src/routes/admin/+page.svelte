<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { user } from '$lib/client';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';

	async function copyToken() {
		await navigator.clipboard.writeText((await $user.token())!);
		toast('Copied to clipboard!')
	}
</script>

<svelte:head>

</svelte:head>

{#if $user.loggedIn && $user.data.isAdmin}
	<Title value="Admin" />

	<div class="wrapper">
		<a href="/admin/ratingEstimator">Rating estimator</a><br>
		<a href="/admin/submission">Submission</a><br>
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
