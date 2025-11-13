<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/client/user';
	import { isActive } from '$lib/client/isSupporterActive';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Misc - Demon List VN</title>
</svelte:head>

{#if $user.loggedIn && isActive($user.data.supporterUntil)}
	<slot />
{:else}
	<Card.Root class="mx-auto mt-[100px] max-w-[600px]">
		<Card.Header>
			<Card.Title class="text-center">Supporter Feature</Card.Title>
		</Card.Header>
		<Card.Content>
			<p class="text-center">
				This section contains exclusive features for supporters. Please consider supporting us to
				unlock these premium features!
			</p>
		</Card.Content>
		<Card.Footer class="flex justify-center gap-4">
			<Button variant="outline" on:click={() => goto('/')}>Go Home</Button>
			<Button on:click={() => goto('/supporter')}>Become a Supporter</Button>
		</Card.Footer>
	</Card.Root>
{/if}
