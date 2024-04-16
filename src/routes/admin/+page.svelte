<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { user } from '$lib/client';
</script>

{#if $user.loggedIn && $user.data.isAdmin}
	<Title value="Admin" />

	<div class="wrapper">
		<a href="/admin/ratingEstimator">Rating estimator</a>
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
