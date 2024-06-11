<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import LockClosed from 'svelte-radix/LockClosed.svelte';
	import Globe from 'svelte-radix/Globe.svelte';
	import StarFilled from 'svelte-radix/StarFilled.svelte';
	import type { PageData } from './$types';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data: PageData;
	let editedData = data;
	let currentTab: string = 'members'
	let members: any[] = [];
	let records: any[] = [];
	let membersFilter = {
		start: 0,
		end: 50,
		sortBy: 'name',
		ascending: true
	};
	let recordsFilter = {
		start: 0,
		end: 50,
		sortBy: 'timestamp',
		ascending: false
	};

	function fetchMembers() {
		fetch(`${import.meta.env.VITE_API_URL}/clan/${$page.params.id}/members`)
			.then((res) => res.json())
			.then((res) => {
				members = res;
			});
	}

	function fetchRecords() {
		fetch(`${import.meta.env.VITE_API_URL}/clan/${$page.params.id}/records`)
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
			</div>
		</div>
	</div>
	<div class="content">
		<Tabs.Root bind:value={currentTab} class="flex w-[100%] flex-col items-center">
			<Tabs.List class="mb-[5px] w-fit">
				<Tabs.Trigger value="members">Members</Tabs.Trigger>
				<Tabs.Trigger value="records">Records</Tabs.Trigger>
				<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="members" class="w-full">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[100px]">No.</Table.Head>
							<Table.Head>Player</Table.Head>
							<Table.Head class="text-right">Rating</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each { length: 10 } as item, index}
							<Table.Row>
								<Table.Cell class="font-medium">#{index + 1}</Table.Cell>
								<Table.Cell>Player name</Table.Cell>
								<Table.Cell class="text-right">1000</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
			<Tabs.Content value="records" class="w-full">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Player</Table.Head>
							<Table.Head class="w-[100px] text-center">Submitted on</Table.Head>
							<Table.Head class="w-[100px] text-center">Device</Table.Head>
							<Table.Head class="w-[80px] text-center">Progress</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each { length: 10 } as item, index}
							<Table.Row
								on:click={(e) => {
									// @ts-ignore
									if (e.target.nodeName == 'A') {
										return;
									}
								}}
							>
								<Table.Cell class="font-medium">Player name</Table.Cell>
								<Table.Cell class="text-center">
									{new Date().toLocaleString()}
								</Table.Cell>
								<Table.Cell class="text-center">
									PC<br />(144fps)
								</Table.Cell>
								<Table.Cell class="text-center">100%</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
			<Tabs.Content value="settings">
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
				<section>
					<h3>Danger zone</h3>
					<Button class="w-full text-red-500" variant="outline">Leave clan</Button>
				</section>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

<style lang="scss">
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
			}

			.bannerContentWrapper {
				border-radius: var(--radius);
				background: rgb(0, 0, 0);
				background: linear-gradient(0deg, rgb(0, 0, 0) 17.5%, rgba(255, 255, 255, 0) 50%);
				position: absolute;
				z-index: 1;
				height: 100%;
				width: 100%;
				padding-bottom: 30px;
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
</style>
