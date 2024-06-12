<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import LockClosed from 'svelte-radix/LockClosed.svelte';
	import Globe from 'svelte-radix/Globe.svelte';
	import StarFilled from 'svelte-radix/StarFilled.svelte';
	import type { PageData } from './$types';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import RecordDetail from '$lib/components/recordDetail.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/client';

	export let data: PageData;
	let editedData = data;
	let currentTab: string = 'members';
	let members: any[] = [];
	let records: any[] = [];
	let membersFilter: any = {
		start: 0,
		end: 50,
		sortBy: 'name',
		ascending: true
	};
	let recordsFilter: any = {
		start: 0,
		end: 50,
		sortBy: 'timestamp',
		ascending: false
	};
	let opened = false;
	let uid: string, levelID: number;

	function fetchMembers() {
		fetch(
			`${import.meta.env.VITE_API_URL}/clan/${$page.params.id}/members?${new URLSearchParams(membersFilter).toString()}`
		)
			.then((res) => res.json())
			.then((res) => {
				members = res;
			});
	}

	function fetchRecords() {
		fetch(
			`${import.meta.env.VITE_API_URL}/clan/${$page.params.id}/records?${new URLSearchParams(recordsFilter).toString()}`
		)
			.then((res) => res.json())
			.then((res) => {
				records = res;
			});
	}

	onMount(async () => {
		fetchMembers();
		fetchRecords();
	});
</script>

<svelte:head>
	<title>{data.name}'s clan info - Demon List VN</title>
</svelte:head>

<RecordDetail {levelID} {uid} bind:open={opened} />

<div class="wrapper">
	<div class="banner">
		<img
			class="bg"
			src="https://img.goodfon.com/wallpaper/nbig/8/64/navi-logo-yellow-background.webp"
			alt="bg"
		/>
		<div class="bannerContentWrapper">
			<div class="bannerContent">
				<h3>{data.tag}</h3>
				<h2>{data.name}</h2>
				<div class="flex items-center gap-[5px]">
					{#if data.isPublic}
						<Globe size={20} /> Public
					{:else}
						<LockClosed size={20} /> Private
					{/if}
				</div>
				<div class="flex items-center gap-[5px]">
					<StarFilled size={20} />
					<PlayerHoverCard player={{ data: data.players }} />
				</div>
				<div class="bannerBtn">
					{#if $user.loggedIn}
						{#if $user.data.clan == $page.params.id}
							<Button variant="outline" class="w-full">Invite</Button>
						{:else}
							<Button variant="outline" class="w-full">Join</Button>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="content">
		<Tabs.Root bind:value={currentTab} class="flex w-[100%] flex-col items-center">
			<Tabs.List class="mb-[5px] w-fit">
				<Tabs.Trigger value="members">Members</Tabs.Trigger>
				<Tabs.Trigger value="records">Records</Tabs.Trigger>
				{#if $user.loggedIn && $user.data.clan == $page.params.id}
					<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
				{/if}
			</Tabs.List>
			<Tabs.Content value="members" class="w-full">
				<div class="filter">
					<div class="filterItem">
						<Label>Sort by</Label>
						<Select.Root>
							<Select.Trigger class="w-[200px]">
								<Select.Value placeholder="Select item to sort by" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="name">A-Z</Select.Item>
								<Select.Item value="rating">Demon List Rating</Select.Item>
								<Select.Item value="flrank">Total FL point</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="filterItem">
						<Label>Ascending</Label>
						<Switch />
					</div>
					<Button variant="outline">Apply</Button>
				</div>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[50px]">No.</Table.Head>
							<Table.Head>Player</Table.Head>
							{#if membersFilter.sortBy == 'rating'}
								<Table.Head class="w-[100px] text-right">Rating</Table.Head>
							{:else if membersFilter.sortBy == 'flrank'}
								<Table.Head class="w-[100px] text-right">Total FL point</Table.Head>
							{:else}
								<Table.Head class="w-[100px] text-right">Rating</Table.Head>
								<Table.Head class="w-[100px] text-right">Total FL point</Table.Head>
							{/if}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each members as item, index}
							<Table.Row>
								<Table.Cell class="font-medium">
									#{index + 1}
									{#if membersFilter.sortBy == 'rating'}
										({item.rating})
									{:else if membersFilter.sortBy == 'flrank'}
										({item.flrank})
									{/if}
								</Table.Cell>
								<Table.Cell><PlayerHoverCard player={{ data: item }} /></Table.Cell>
								<Table.Cell class="text-right">{item.rating}</Table.Cell>
								<Table.Cell class="text-right">{item.totalFLpt}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
			<Tabs.Content value="records" class="w-full">
				<div class="filter">
					<div class="filterItem">
						<Label>Sort by</Label>
						<Select.Root>
							<Select.Trigger class="w-[200px]">
								<Select.Value placeholder="Select item to sort by" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="name">Timestamp</Select.Item>
								<Select.Item value="rating">Demon List Rating</Select.Item>
								<Select.Item value="flrank">FL point</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="filterItem">
						<Label>Ascending</Label>
						<Switch />
					</div>
					<Button variant="outline">Apply</Button>
				</div>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[50px]">No.</Table.Head>
							<Table.Head class="w-[100px]">Player</Table.Head>
							<Table.Head>Level</Table.Head>
							<Table.Head class="w-[100px] text-center">Submitted on</Table.Head>
							<Table.Head class="w-[100px] text-center">Device</Table.Head>
							<Table.Head class="w-[80px] text-center">Progress</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each records as item, index}
							<Table.Row
								on:click={(e) => {
									// @ts-ignore
									if (e.target.nodeName != 'TD') {
										return;
									}

									uid = item.players.uid;
									levelID = item.levels.id;
									opened = true;
								}}
							>
								<Table.Cell class="font-medium">
									#{index + 1}
								</Table.Cell>
								<Table.Cell>
									<PlayerHoverCard player={{ data: item.players }} />
								</Table.Cell>
								<Table.Cell>
									<a href={`/level/${item.levels.id}`}>{item.levels.name}</a>
								</Table.Cell>
								<Table.Cell class="text-center">
									{new Date(item.timestamp).toLocaleString()}
								</Table.Cell>
								<Table.Cell class="text-center">
									{item.mobile ? 'Mobile' : 'PC'}<br />({item.refreshRate}fps)
								</Table.Cell>
								<Table.Cell class="text-center">{item.progress}%</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
			<Tabs.Content value="settings">
				{#if $user.loggedIn && data.owner == $user.data.uid}
					<section>
						<h3>Basic info</h3>
						<div class="mb-[10px] grid w-[500px] grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Clan's name</Label>
							<Input id="name" class="col-span-3" bind:value={editedData.name} />
						</div>
						<div class="mb-[10px] grid w-[500px] grid-cols-4 items-center gap-4">
							<Label for="tag" class="text-right">Clan's tag</Label>
							<Input id="tag" class="col-span-3" bind:value={editedData.tag} />
						</div>
						<div class="mb-[10px] grid w-[500px] grid-cols-4 items-center gap-4">
							<Label for="public" class="text-right">Public</Label>
							<Switch id="tag" class="col-span-3" bind:value={editedData.isPublic} />
						</div>
						<Button variant="outline" class="mb-[10px] w-full">Change clan photo</Button>
						<div class="applyBtnWrapper">
							<Button>Apply</Button>
						</div>
					</section>
				{/if}
				<section>
					<h3>Danger zone</h3>
					{#if $user.loggedIn && $user.data.uid == data.owner}
						<Button class="mb-[10px] w-full text-red-500" variant="outline"
							>Transfer ownership</Button
						>
						<Button class="mb-[10px] w-full text-red-500" variant="outline">Delete clan</Button>
					{:else}
						<Button class="w-full text-red-500" variant="outline">Leave clan</Button>
					{/if}
				</section>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

<style lang="scss">
	section {
		h3 {
			margin-bottom: 10px;
		}
	}

	.wrapper {
		margin-top: 100px;
		display: grid;
		grid-template-columns: 400px calc(100% - 400px);
		gap: 40px;
		padding-inline: 80px;

		.banner {
			width: 100%;
			height: 500px;
			border-radius: var(--radius);
			border: 1px solid var(--border1);
			position: relative;

			.bg {
				border-radius: var(--radius);
				object-fit: cover;
				position: absolute;
				z-index: 0;
				width: 100%;
				height: 100%;
				border: 1px solid var(--border1);
				padding-bottom: 20%;
			}

			.bannerContentWrapper {
				border-radius: var(--radius);
				background: rgb(0, 0, 0);
				background: linear-gradient(0deg, rgb(0, 0, 0) 20%, rgba(255, 255, 255, 0) 65%);
				position: absolute;
				z-index: 1;
				height: 100%;
				width: 100%;
				padding-bottom: 18px;
				padding-inline: 18px;
				display: flex;
				flex-direction: column-reverse;

				h2 {
					font-size: 36px;
					font-weight: 600;
				}

				h3 {
					font-size: 20px;
					margin-bottom: -10px;
				}

				.bannerContent {
					display: flex;
					flex-direction: column;
					gap: 5px;
				}

				.bannerBtn {
					width: 100%;
					display: flex;
					justify-content: space-between;
					gap: 10px;
					margin-top: 10px;
				}
			}
		}

		.content {
			width: 100%;

			.applyBtnWrapper {
				display: flex;
				flex-direction: row-reverse;
			}

			h3 {
				font-weight: bold;
			}

			section {
				margin-bottom: 20px;
			}
		}
	}

	.filter {
		display: flex;
		gap: 30px;
		margin-bottom: 10px;
		justify-content: center;
		border-radius: var(--radius);
		border: 1px solid var(--border1);
		padding-top: 10px;
		padding-bottom: 10px;
		width: fit-content;
		padding-inline: 20px;
		margin-inline: auto;

		.filterItem {
			display: flex;
			gap: 10px;
			align-items: center;
		}
	}
</style>
