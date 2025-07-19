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
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Detail</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>Order ID: {data.id}</p>
			<p>Status: <b>{data.state} {data.delivered ? 'and DELIVERED' : ''}</b></p>
			<div class='flex gap-[10px]'>
				<p>Shipping info:</p>
				<div>
					<p>{data.recipentName}</p>
					<p>{data.address}</p>
					<p>+84 {String(data.phone).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
