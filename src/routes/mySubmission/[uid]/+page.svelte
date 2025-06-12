<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { toast } from 'svelte-sonner';
	import Title from '$lib/components/Title.svelte';
	import { user } from '$lib/client';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import CrossCircled from 'svelte-radix/CrossCircled.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import RecordDetail from '$lib/components/recordDetail.svelte';

	export let data: PageData;
	let alertOpened = false;
	let lvID: number;
	let userID: string, levelID: number;
	let recordDetailOpened = false;

	function getTimeString(ms: number) {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		const milliseconds = ms % 1000;

		return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
	}

	async function deleteRecord() {
		const { uid } = $user.data;
		const token = await $user.token();

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/record/${uid}/${lvID}`, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + token
				}
			}),
			{
				loading: 'Cancelling submission...',
				success: () => {
					data.data = data.data.filter((x) => {
						return x.levelid != lvID;
					});

					return 'Submission cancelled!';
				},
				error: (err) => {
					return 'Failed to cancel submission.';
				}
			}
		);
	}
</script>

<svelte:head>
	<title>My submissions - Demon List VN</title>
</svelte:head>

<RecordDetail bind:open={recordDetailOpened} uid={userID} {levelID} />

<AlertDialog.Root bind:open={alertOpened}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Cancel submission?</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={deleteRecord}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

{#if $user.loggedIn && $user.data.uid == $page.params.uid}
	<Title value="My submissions" />
	<div class="wrapper">
		<Table.Root>
			<Table.Caption>Total record: {data.data.length}</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Level</Table.Head>
					<Table.Head class="w-[100px] text-center">Submitted on</Table.Head>
					<Table.Head class="w-[100px] text-center">Device</Table.Head>
					<Table.Head class="w-[80px] text-center">Progress</Table.Head>
					<Table.Head class="w-[80px] text-center">Time</Table.Head>
					<Table.Head class="w-[80px] text-center">Queue no.</Table.Head>
					<Table.Head class="w-[0px] text-center"></Table.Head>
					<Table.Head class="w-[0px] text-center"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.data as record}
					<Table.Row
						on:click={(e) => {
							// @ts-ignore
							if (e.target.nodeName != 'TD') {
								return;
							}

							userID = record.userid;
							levelID = record.levels.id;
							recordDetailOpened = true;
						}}
					>
						<Table.Cell class="font-medium">
							<a href={`/level/${record.levels.id}`} data-sveltekit-preload-data="tap">
								{record.levels.name}
							</a>
						</Table.Cell>
						<Table.Cell class="text-center"
							>{new Date(record.timestamp).toLocaleString('vi-VN')}</Table.Cell
						>
						<Table.Cell class="text-center">
							{record.mobile ? 'Mobile' : 'PC'}
							{#if record.refreshRate}
								<br />({record.refreshRate}fps)
							{/if}
						</Table.Cell>
						<Table.Cell class="text-center"
							>{!record.levels.isPlatformer ? `${record.progress}%` : '-'}</Table.Cell
						>
						<Table.Cell class="text-center"
							>{record.levels.isPlatformer ? getTimeString(record.progress) : '-'}</Table.Cell
						>
						<Table.Cell class="text-center">
							{#if record.needMod}
								Forwarded
							{:else if !record.queueNo}
								-
							{:else}
								{record.queueNo}
							{/if}
						</Table.Cell>
						<Table.Cell class="text-center">
							<button>
								<a href={record.videoLink} target="_blank">
									<ExternalLink size={20} />
								</a>
							</button>
						</Table.Cell>
						<Table.Cell class="text-center">
							<button
								on:click={() => {
									lvID = record.levelid;
									alertOpened = true;
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
{/if}

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
