<script lang="ts">
	import type { PageData } from './$types';
	import Clock from 'svelte-radix/Clock.svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';

	export let data: PageData;
	let rewardState = 0;
	let proof = '';
	let claimOpened = false;
	let cancelOpened = false;

	function getInterval(end: string | null) {
		if (!end) {
			return 'Permanent';
		}

		const second = (new Date(end).getTime() - new Date().getTime()) / 1000;
		const day = Math.floor(second / 86400);
		const hour = Math.floor((second - day * 86400) / 3600);

		return `${day}d ${hour}h`;
	}

	function getRewardState() {
		if (!$user.loggedIn || !data.exp) {
			return;
		}

		fetch(`${import.meta.env.VITE_API_URL}/event/${$page.params.id}/proof/${$user.data.uid}`)
			.then((res) => {
				if (!res.ok) {
					rewardState = 3;
				}

				return res.json();
			})
			.then((res) => {
				if (res.accepted) {
					rewardState = 1;
				} else {
					rewardState = 2;
				}
			});
	}

	async function claimReward() {
		claimOpened = false;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/proof`, {
				method: 'POST',
				body: JSON.stringify({
					eventID: parseInt($page.params.id),
					content: proof
				}),
				headers: {
					Authorization: 'Bearer ' + (await $user.token())!,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					rewardState = 2;
					proof = '';

					return 'Sent!';
				},
				loading: 'Sending proof...',
				error: 'An error occured'
			}
		);
	}

	async function cancelProof() {
		cancelOpened = false;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/${$page.params.id}/proof/${$user.data.uid}`, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())!
				}
			}),
			{
				success: () => {
					rewardState = 3;

					return 'Cancelled';
				},
				loading: 'Cancelling...',
				error: 'An error occured'
			}
		);
	}

	$: $user.loggedIn && getRewardState();

	onMount(() => {
		getRewardState();
	});
</script>

<svelte:head>
	<title>{data.title} - Demon List VN</title>
</svelte:head>

<div class="p-1">
	<div class="promotion" style={`background-image: url('${data.imgUrl}')`}>
		<div class="promotionContent">
			<div class="flex gap-[10px]">
				<div class="period">
					<Clock size={16} />
					{getInterval(data.end)}
				</div>
				{#if data.exp}
					<div class="period">
						{data.exp} EXP
					</div>
				{/if}
			</div>
			<h2>{data.title}</h2>
			{#if data.redirect}
				<a href={data.redirect} target="_blank">
					<div class="flex gap-[10px]">
						<ExternalLink />
						{data.redirect}
					</div>
				</a>
			{/if}
			<p class="desc">{data.description}</p>
		</div>
	</div>
</div>
{#if data.exp && $user.loggedIn}
	<div class="md-[15px] mt-[15px] flex justify-center">
		{#if rewardState == 0}
			<Skeleton class="h-[35px] w-[200px]" />
		{:else if rewardState == 1}
			<Button class="w-[200px]" disabled>Claimed</Button>
		{:else if rewardState == 2}
			<Dialog.Root bind:open={cancelOpened}>
				<Dialog.Trigger>
					<Button class="w-[200px]" variant="destructive">Cancel reward claim</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Cancel?</Dialog.Title>
						<Dialog.Description>This action cannot be undone.</Dialog.Description>
					</Dialog.Header>
					<Button variant="destructive" on:click={cancelProof}>Proceed</Button>
				</Dialog.Content>
			</Dialog.Root>
		{:else if rewardState == 3}
			<Dialog.Root bind:open={claimOpened}>
				<Dialog.Trigger>
					<Button class="w-[200px]">Claim reward</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Claim reward</Dialog.Title>
					</Dialog.Header>
					<Textarea class="h-[125px]" placeholder="Provide proof" bind:value={proof} />
					<Button on:click={claimReward}>Continue</Button>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
{/if}
<div class="content markdown">
	{#if data.content}
		<SvelteMarkdown source={data.content} />
	{/if}
</div>

<style lang="scss">
	.desc {
		width: 650px;
		max-width: 100%;
	}

	.content {
		padding-inline: 200px;
	}

	.promotion {
		border: 1px solid hsl(var(--border));
		border-radius: 10px;
		background-position: center;
		aspect-ratio: 40 / 10;
		background-size: cover;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: white;
		min-height: 250px;
		max-width: 100%;

		.period {
			background-color: white;
			width: fit-content;
			padding-inline: 8px;
			color: black;
			font-weight: 600;
			text-shadow: none;
			border-radius: 10px;
			display: flex;
			align-items: center;
			gap: 5px;
			line-height: 0;
			padding-top: 3px;
			padding-bottom: 3px;
		}

		.promotionContent {
			margin-top: auto;
			height: 175px;
			padding: 21px;
			text-shadow: black 1px 0 10px;
		}

		h2 {
			font-weight: bold;
			font-size: 28px;
		}
	}

	@media screen and (max-width: 900px) {
		.content {
			padding-inline: 10px;
		}
	}
</style>
