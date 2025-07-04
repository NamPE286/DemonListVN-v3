<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { isSupporterActive } from '$lib/client/isSupporterActive';
	import { Textarea } from '$lib/components/ui/textarea';

	interface SubmitData {
		levelID: number | null;
		progress: number | null;
		videoLink: string;
	}

	export let data: any;

	let rewardState = 0;
	let proof = '';
	let claimOpened = false;
	let cancelOpened = false;
	let submitData: SubmitData = {
		levelID: null,
		progress: null,
		videoLink: ''
	};
	let selectedLevel = {
		disabled: false,
		label: undefined,
		value: undefined
	};

	function isEventEnded() {
		return new Date(data.end) < new Date();
	}

	function getRewardState() {
		if (data.end && new Date().getTime() > new Date(data.end).getTime()) {
			rewardState = 4;
			return;
		}

		if (!$user.loggedIn || !data.exp) {
			return;
		}

		fetch(`${import.meta.env.VITE_API_URL}/event/8/proof/${$user.data.uid}`)
			.then((res) => {
				if (!res.ok) {
					rewardState = 4;
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
		if (selectedLevel.value === undefined) {
			toast.error('Please fill in all required fields');
		}

		submitData.levelID = selectedLevel.value!;

		if (submitData.progress === null || !(1 <= submitData.progress && submitData.progress <= 100)) {
			toast.error('Invalid progress range');
		}

		if (submitData.videoLink === '') {
			toast.error('Please fill in all required fields');
		}

		claimOpened = false;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/proof`, {
				method: 'POST',
				body: JSON.stringify({
					eventID: 8,
					content: proof,
					data: submitData
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
			fetch(`${import.meta.env.VITE_API_URL}/event/8/proof/${$user.data.uid}`, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())!
				}
			}),
			{
				success: () => {
					rewardState = 4;

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

{#if data.exp && $user.loggedIn}
	{#if !data.supporterOnly || isSupporterActive($user.data.supporterUntil)}
		<div class="md-[15px] mb-[15px] mt-[15px] flex justify-center">
			{#if rewardState == 0}
				<Skeleton class="h-[35px] w-[200px]" />
			{:else if rewardState == 1}
				<Button class="w-[200px]" disabled>Reward claimed</Button>
			{:else if rewardState == 2}
				<Dialog.Root bind:open={cancelOpened}>
					<Dialog.Trigger>
						<Button class="w-[200px]" variant="destructive">Cancel participation</Button>
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
				<Button class="w-[200px]" disabled>Event ended</Button>
			{:else if rewardState == 4}
				{#if $user.data.exp < data.minExp}
					<Button class="w-[300px]" disabled>Not enough EXP ({data.minExp} EXP minimum)</Button>
				{:else if isEventEnded()}
					<Button class="w-[200px]" disabled>Event ended</Button>
				{:else}
					<Dialog.Root bind:open={claimOpened}>
						<Dialog.Trigger>
							<Button class="w-[200px]">Participate</Button>
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Participate</Dialog.Title>
							</Dialog.Header>
							{#if data.needProof}
								<Textarea class="h-[125px]" placeholder="Provide proof" bind:value={proof} />
							{:else}
								<Textarea class="h-[125px]" placeholder="Message (optional)" bind:value={proof} />
							{/if}
							<Button on:click={claimReward}>Continue</Button>
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			{/if}
		</div>
	{:else}
		<div class="md-[15px] mb-[15px] mt-[15px] flex justify-center">
			<Button class="w-[200px]" disabled>Not eligible</Button>
		</div>
	{/if}
{/if}
