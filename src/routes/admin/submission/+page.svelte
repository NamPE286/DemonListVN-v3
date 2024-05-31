<script lang="ts">
	import RecordDetail from '$lib/components/recordDetail.svelte';
	import Title from '$lib/components/Title.svelte';
	import * as Table from '$lib/components/ui/table';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import CrossCircled from 'svelte-radix/CrossCircled.svelte';
	import CheckCircled from 'svelte-radix/CheckCircled.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let isOpen = false;
	let userID: string, levelID: number;
</script>

<RecordDetail bind:open={isOpen} uid={userID} {levelID} />

<Title value="Submission" />

<div class="wrapper">
	<Table.Root>
		<Table.Caption>Total record: {data.data.length}</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Level</Table.Head>
				<Table.Head class="w-[100px] text-center">Submitted by</Table.Head>
				<Table.Head class="w-[100px] text-center">Device</Table.Head>
				<Table.Head class="w-[80px] text-center">Progress</Table.Head>
				<Table.Head class="w-[0px] text-center"></Table.Head>
				<Table.Head class="w-[0px] text-center"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.data as record}
				<Table.Row
					on:click={(e) => {
						// @ts-ignore
						if (e.target.nodeName == 'A') {
							return;
						}

						userID = record.data.players.uid
						levelID = record.data.levels.id
						isOpen = true
					}}
				>
					<Table.Cell class="font-medium">
						<a href={`/level/${record.data.levels.id}`} data-sveltekit-preload-data="tap">
							{record.data.levels.name}
						</a>
					</Table.Cell>
					<Table.Cell class="text-center"
						><a href={`/player/${record.data.players.uid}`}>{record.data.players.name}</a
						></Table.Cell
					>
					<Table.Cell class="text-center">
						{record.data.mobile ? 'Mobile' : 'PC'}<br />({record.data.refreshRate}fps)
					</Table.Cell>
					<Table.Cell class="text-center">{record.data.progress}%</Table.Cell>
					<Table.Cell class="text-center">
						<button on:click={() => {}}>
							<CheckCircled size={20} />
						</button>
					</Table.Cell>
					<Table.Cell class="text-center">
						<button on:click={() => {}}>
							<CrossCircled size={20} />
						</button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<style lang="scss">
	.wrapper {
		padding-inline: 50px;
	}

	@media screen and (max-width: 900px) {
		.wrapper {
			padding-inline: 10px;
		}
	}
</style>
