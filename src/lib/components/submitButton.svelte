<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { user } from '$lib/client';

	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';

	const defaultValue: any = {
		levelid: NaN,
		userid: $user.data.uid,
		progress: NaN,
		refreshRate: '',
		videoLink: '',
		mobile: null,
		suggestedRating: NaN,
		comment: ''
	};

	let submission: any = {
		levelid: NaN,
		userid: $user.data.uid,
		progress: NaN,
		refreshRate: '',
		videoLink: '',
		mobile: null,
		suggestedRating: NaN,
		comment: ''
	};

	let sendStatus = 0;
	let open = false;

	async function submit() {
		if (submission.mobile != null) {
			submission.mobile = submission.mobile.value;
		}

		fetch(`${import.meta.env.VITE_API_URL}/submission`, {
			method: 'POST',
			body: JSON.stringify(submission),
			headers: {
				Authorization: `Bearer ${await $user.token()}`,
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			if (res.ok) {
				sendStatus = 1;
			} else {
				sendStatus = 2;
			}
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline' })}
		on:click={() => {
			for (const i in submission) {
				// @ts-ignore
				submission[i] = defaultValue[i];
			}
		}}>Submit</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Submit</Dialog.Title>
		</Dialog.Header>

		<Alert.Root>
			<ExclamationTriangle class="h-4 w-4" />
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description>
				- Read the <button on:click={() => (open = false)}><a href="/rules"><u>rules</u></a></button
				>
				before submitting.<br />
				- Optional field can be left blank.<br />
				- Suggested rating is Demon List VN level's rating, not level's stars or placement.
			</Alert.Description>
		</Alert.Root>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Level ID</Label>
				<Input id="name" type="number" bind:value={submission.levelid} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Progress</Label>
				<Input id="name" type="number" bind:value={submission.progress} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">FPS</Label>
				<Input id="name" type="number" bind:value={submission.refreshRate} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Video's link</Label>
				<Input id="name" bind:value={submission.videoLink} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Platform</Label>
				<Select.Root bind:selected={submission.mobile}>
					<Select.Trigger class="col-span-3">
						<Select.Value placeholder="Select a platform" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Platform</Select.Label>
							<Select.Item value={false} label="PC">PC</Select.Item>
							<Select.Item value={true} label="Mobile">Mobile</Select.Item>
						</Select.Group>
					</Select.Content>
					<Select.Input name="platform" value={true} />
				</Select.Root>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Rating suggestion</Label>
				<Input
					id="name"
					type="number"
					disabled={submission.progress != 100}
					bind:value={submission.suggestedRating}
					placeholder={submission.progress == 100
						? 'optional (không ghi cũng được)'
						: 'progress must be 100%'}
					class="col-span-3"
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Comment</Label>
				<Input
					id="name"
					bind:value={submission.comment}
					placeholder="optional (không ghi cũng được)"
					class="col-span-3"
				/>
			</div>
		</div>
		<Dialog.Footer>
			<AlertDialog.Root>
				<AlertDialog.Trigger asChild let:builder>
					<Button
						type="submit"
						builders={[builder]}
						on:click={() => {
							sendStatus = 0;
							submit();
						}}>Submit</Button
					>
				</AlertDialog.Trigger>
				{#if sendStatus == 0}
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Sending your submission...</AlertDialog.Title>
							<AlertDialog.Description>This may take a while.</AlertDialog.Description>
						</AlertDialog.Header>
					</AlertDialog.Content>
				{:else if sendStatus == 1}
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Submitted!</AlertDialog.Title>
							<AlertDialog.Description>
								Your submission has been sent! It may take a few day for a moderator to approve your
								submission.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel on:click={() => (open = false)}>Close</AlertDialog.Cancel>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				{:else if sendStatus == 2}
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Something happened</AlertDialog.Title>
							<AlertDialog.Description>
								We are unable to send your submission. If this problem presist, please contact with
								a moderator to resolve this issue.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel on:click={() => (open = false)}>Close</AlertDialog.Cancel>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				{/if}
			</AlertDialog.Root>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
