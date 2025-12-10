<script lang="ts">
	import { user } from '$lib/client';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{#if $user.loggedIn && $user.data.isAdmin}
	{@render children?.()}
{/if}
