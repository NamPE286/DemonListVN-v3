<script lang="ts">
	import type { Level } from './type';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';
	import { Copy } from 'svelte-radix';
	import { isActive } from '$lib/client/isSupporterActive';

	interface SubmitData {
		levelID: number | null;
		progress: number | null;
		videoLink: string;
		raw: string;
	}

	export let level: Level | null;
	export let index: number;
	export let records: any[];
	export let event: any;

	let submitData: SubmitData = {
		levelID: level ? level.id : 0,
		progress: null,
		videoLink: '',
		raw: ''
	};

	function isEventEnded() {
		return new Date(event.end) < new Date();
	}

	function indexToRoman(num: number): string {
		const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
		const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
		let result = '';
		for (let i = 0; i < values.length; i++) {
			while (num >= values[i]) {
				num -= values[i];
				result += romanNumerals[i];
			}
		}
		return result;
	}

	async function submit() {
		if (level === null) {
			return;
		}

		if (!submitData.progress || !submitData.videoLink) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (level.needRaw && !submitData.raw) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!(0 < submitData.progress && submitData.progress <= 100)) {
			toast.error('Invalid progress');
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/submit`, {
				method: 'POST',
				body: JSON.stringify(submitData),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					window.location.reload();
					return 'Submitted!';
				},
				error: 'Failed to submit',
				loading: 'Submitting...'
			}
		);
	}

	async function cancel() {
		if (level === null) {
			return;
		}

		if (!confirm('Cancel submission? This cannot be undone')) {
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}/submission/${level.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			}),
			{
				success: () => {
					window.location.reload();
					return 'Cancelled!';
				},
				error: 'Failed to cancel',
				loading: 'Cancelling...'
			}
		);
	}

	function copyID() {
		if (!level) {
			return;
		}

		navigator.clipboard
			.writeText(level.levelID.toString())
			.then(() => toast.success('Copied to clipboard!'))
			.catch(() => toast.error('Failed to copy'));
	}
</script>

<Card.Root class="flex flex-col items-center p-2 md:flex-row">
	<div class="flex w-full items-center">
		<a href={`https://www.youtube.com/watch?v=${level ? level.videoID : ''}`} target="_blank">
			<img
				src={`https://img.youtube.com/vi/${level ? level.videoID : ''}/0.jpg`}
				alt="level"
				class="h-[100px] w-[177px] rounded-xl object-cover"
			/>
		</a>
		<Card.Content class="mt-[22.5px] flex flex-col justify-center">
			<div class="flex items-center gap-[10px]">
				<div class="flex items-center gap-[5px]">
					<h2 class="text-xl font-bold">{indexToRoman(index + 1)}. {level ? level.name : '???'}</h2>
					<span
						class="inline h-fit rounded-sm bg-[var(--textColor)] pl-[5px] pr-[5px] text-[12px] font-semibold text-[var(--textColorInverted)]"
						>{level ? level.point : '???'}pt</span
					>
					{#if level && level.needRaw}
						<span
							class="inline rounded-sm bg-[var(--textColor)] pl-[5px] pr-[5px] text-[12px] font-semibold text-[var(--textColorInverted)]"
							>Raw Required</span
						>
					{/if}
				</div>
			</div>
			<div class="flex flex-col">
				by {level ? level.creator : '???'}
				<button class="flex items-center gap-[5px]" on:click={copyID}>
					ID: {level ? level.levelID : '???'}
					{#if level}
						<Copy size={15} />
					{/if}
				</button>
			</div>
		</Card.Content>
	</div>
	<div class="ml-auto w-full md:mr-[22.5px] md:w-fit">
		<!-- {#if $user.loggedIn && $user.data.discord && !isEventEnded() && level && (!event.isSupporterOnly || isActive($user.data.supporterUntil))}
			{#if records.length == 0}
				<Button class="w-full" variant="secondary" disabled>...</Button>
			{:else if records[index] === null}
				<Dialog.Root>
					<Dialog.Trigger class="w-full">
						<Button class="w-full">Submit</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Submit {level.name}</Dialog.Title>
						</Dialog.Header>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Progress</Label>
							<Input
								type="number"
								inputmode="numeric"
								min="1"
								max="100"
								bind:value={submitData.progress}
								class="col-span-3"
								placeholder="Required (decimal allowed .e.g 99.99)"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Video's Link</Label>
							<Input bind:value={submitData.videoLink} placeholder="Required" class="col-span-3" />
						</div>
						{#if level.needRaw}
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-right">Raw</Label>
								<Input bind:value={submitData.raw} placeholder="Required" class="col-span-3" />
							</div>
						{/if}
						<Button on:click={submit}>Submit</Button>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<Button class="w-full" variant="destructive" on:click={cancel}>Cancel</Button>
			{/if}
		{/if} -->
	</div>
</Card.Root>
