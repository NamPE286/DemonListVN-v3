<script lang="ts">
	import { user } from '$lib/client';
</script>

{#if $user.loggedIn && $user.data.isAdmin}
	<slot />
{/if}
