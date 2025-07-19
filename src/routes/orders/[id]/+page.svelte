<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/Title.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	export let data: PageData;
</script>

<Title value="Order Details" />

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[800px] max-w-full items-center pl-[15px] pr-[15px]"
>
	<Card.Root class='w-full'>
		<Card.Header>
			<Card.Title>Shipping Details</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>Card Content</p>
		</Card.Content>
	</Card.Root>
</div>
