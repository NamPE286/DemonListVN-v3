<script lang="ts">
	import RecordDetail from '$lib/components/recordDetail.svelte';
	import Title from '$lib/components/Title.svelte';
	import * as Table from '$lib/components/ui/table';
	import CrossCircled from 'svelte-radix/CrossCircled.svelte';
	import CheckCircled from 'svelte-radix/CheckCircled.svelte';
	import type { PageData } from './$types';
	import { user } from '$lib/client';

	export let data: PageData;

	let isOpen = false;
	let userID: string, levelID: number;

	async function accept(userID: string, levelID: number) {
		if (!confirm('Accept this record?')) {
			return;
		}

		await fetch(`${import.meta.env.VITE_API_URL}/record`, {
			method: 'PUT',
			body: JSON.stringify({
				userid: userID,
				levelid: levelID,
				isChecked: true
			}),
			headers: {
				Authorization: `Bearer ${await $user.token()}`,
				'Content-Type': 'application/json'
			}
		});
		
		window.location.reload();
	}

	async function reject(userID: string, levelID: number) {
		if (!confirm('Reject this record?')) {
			return;
		}

		await fetch(`${import.meta.env.VITE_API_URL}/record/${userID}/${levelID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${await $user.token()}`
			}
		});

		window.location.reload();
	}
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
						if (e.target.nodeName == 'A' || e.target.nodeName == 'svg') {
							return;
						}

						userID = record.data.players.uid;
						levelID = record.data.levels.id;
						isOpen = true;
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
						<button
							on:click={() => {
								accept(record.data.players.uid, record.data.levels.id);
							}}
						>
							<CheckCircled size={20} />
						</button>
					</Table.Cell>
					<Table.Cell class="text-center">
						<button
							on:click={() => {
								reject(record.data.players.uid, record.data.levels.id);
							}}
						>
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
