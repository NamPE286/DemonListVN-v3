<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { user } from '$lib/client';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Orders - Demon List VN</title>
</svelte:head>

{#if $user.loggedIn && $user.data.uid == $page.params.uid}
	<Title value="Orders" />
	<div class="pl-[10px] pr-[10px] lg:pl-[70px] lg:pr-[70px]">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[180px]">ID</Table.Head>
					<Table.Head class="w-[200px]">Product</Table.Head>
					<Table.Head class="w-[60px]">Quantity</Table.Head>
					<Table.Head class="w-[60px]">Discount</Table.Head>
					<Table.Head class="w-[100px]">Coupon</Table.Head>
					<Table.Head class="w-[60px]">Amount</Table.Head>
					<Table.Head class="w-[200px]">Recipent</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-right">Action</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="font-medium">INV001</Table.Cell>
					<Table.Cell>DLVN</Table.Cell>
					<Table.Cell>2</Table.Cell>
					<Table.Cell>20%</Table.Cell>
					<Table.Cell>ABCXYZ</Table.Cell>
					<Table.Cell>22.000</Table.Cell>
					<Table.Cell>You</Table.Cell>
					<Table.Cell>Paid</Table.Cell>
					<Table.Cell class="text-right">
						<Button variant="secondary">Pay</Button>
						<Button variant="secondary">Restore</Button>
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</div>
{/if}
