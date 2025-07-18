<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { user } from '$lib/client';
	import Loading from '$lib/components/animation/loading.svelte';
	import { toast } from 'svelte-sonner';
	import { isSupporterActive } from '$lib/client/isSupporterActive';
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';

	const defaultValue: any = {
		levelid: NaN,
		userid: $user.data.uid,
		progress: NaN,
		refreshRate: '',
		videoLink: '',
		raw: '',
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
		raw: '',
		mobile: null,
		suggestedRating: NaN,
		comment: ''
	};

	let apiLevel: any = null;
	let level: any = null;
	let sendStatus = 0;
	let open = false;
	let step = 0;
	let nextDisabled = false;
	let errorMessage = '';
	let time = {
		m: null,
		s: null,
		ms: null
	};

	function getMs() {
		return parseInt(time.m! || 0) * 60000 + parseInt(time.s! || 0) * 1000 + parseInt(time.ms! || 0);
	}

	function validTime() {
		if (time.m == null || time.s == null || time.ms == null) {
			return false;
		}

		if (time.m < 0 || time.s < 0 || time.ms < 0) {
			return false;
		}

		if (time.s >= 60 || time.ms >= 1000) {
			return false;
		}

		return true;
	}

	async function submit() {
		if (apiLevel.length == 'Plat') {
			submission.progress = getMs();
		}

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
		}).then(async (res) => {
			if (res.ok) {
				sendStatus = 1;
			} else {
				sendStatus = 2;
			}

			errorMessage = (await res.json()).message;
		});
	}

	async function fetchLevel() {
		try {
			level = await (
				await fetch(`${import.meta.env.VITE_API_URL}/level/${submission.levelid}`)
			).json();
		} catch {}

		apiLevel = await (await fetch(`https://gdbrowser.com/api/level/${submission.levelid}`)).json();
	}

	function next() {
		if (step == 1) {
			apiLevel = null;
			nextDisabled = true;

			fetchLevel()
				.then(() => {
					nextDisabled = false;
				})
				.catch(() => {
					toast.error('Invalid level ID');
					nextDisabled = false;
					step--;
				});
		}

		if (step == 3) {
			if (apiLevel.length == 'Plat' && !validTime()) {
				toast.error('Invalid time');
				return;
			}

			if (apiLevel.length != 'Plat') {
				if (
					!submission.progress ||
					!submission.refreshRate ||
					!submission.videoLink ||
					!submission.mobile
				) {
					toast.error('Please fill in all required fields');
					return;
				}
			} else {
				if (
					!validTime() ||
					!submission.refreshRate ||
					!submission.videoLink ||
					!submission.mobile
				) {
					toast.error('Please fill in all required fields');
					return;
				}
			}

			if (level) {
				if ((!level.flTop || level.rating) && !submission.raw) {
					toast.error('Please fill in all required fields');
					return;
				}
			} else if (!submission.raw) {
				toast.error('Please fill in all required fields');
				return;
			} else if (submission.raw == submission.videoLink) {
				toast.error('Raw is not completion video.');
				return;
			}

			if (level && submission.progress < level.minProgress) {
				toast.error('Not enough progress');
				return;
			}
		}

		step++;
	}

	function onRouteChange(to: any) {
		if (!$user.loggedIn || !isSupporterActive($user.data.supporterUntil)) {
			defaultValue.levelid = NaN;
			return;
		}

		if (to?.route.id == '/level/[id]') {
			defaultValue.levelid = parseInt(to.params!.id);
		} else {
			defaultValue.levelid = NaN;
		}
	}

	$: if ($navigating) {
		onRouteChange($navigating.to);
	}

	onMount(() => {
		onRouteChange($page);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline' })}
		on:click={() => {
			for (const i in submission) {
				// @ts-ignore
				submission[i] = defaultValue[i];
				step = 0;
				apiLevel = null;
				level = null;
				time = {
					m: null,
					s: null,
					ms: null
				};
			}
		}}>Submit</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
				{#if step == 0}
					Attention
				{:else if step == 1 || step == 2}
					Level
				{:else if step == 3}
					Required fields
				{:else if step == 4}
					Optional fields
				{/if}
			</Dialog.Title>
		</Dialog.Header>
		{#if step == 0}
			<Alert.Root>
				<Alert.Description>
					- Read the <button on:click={() => (open = false)}
						><a href="/rules"><u>rules</u></a></button
					>
					before submitting.<br />
					- Suggested rating is Demon List VN level's rating, not level's stars or placement. <br />
					- Raw is recording from the beginning to the end of the recording session without editing.
					<br />
					- Use
					<a href="https://github.com/NamPE286/DemonListVN-geode-mod/releases">
						<u>Demon List VN's geode mod</u>
					</a> while beating level to have higher chance of acceptance.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root class="border-yellow-400">
				<Alert.Description>
					<a class="underline" href="/supporter">Supporters'</a> submissions are prioritized in the review
					queue. Their records are treated as if they were submitted 7 days earlier (skip ahead by about
					150 submissions).
				</Alert.Description>
			</Alert.Root>
		{/if}
		{#if step > 0}
			<div class="grid gap-4 py-4">
				{#if step == 1}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Level ID</Label>
						<Input
							id="name"
							type="number"
							inputmode="numeric"
							bind:value={submission.levelid}
							class="col-span-3"
						/>
					</div>
				{/if}
				{#if step == 2}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Level ID</Label>
						<Input
							id="name"
							type="number"
							inputmode="numeric"
							bind:value={submission.levelid}
							class="col-span-3"
							disabled={true}
						/>
					</div>
					{#if !apiLevel}
						<Loading inverted={true} />
					{:else}
						<div class="text-center">
							You are going to submit <a href={`/level/${apiLevel.id}`}
								><b><u>{apiLevel.name}</u></b></a
							>
							by {apiLevel.author}
						</div>
					{/if}
				{/if}
				{#if step == 3}
					{#if apiLevel.length != 'Plat'}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Progress</Label>
							<Input
								id="name"
								type="number"
								inputmode="numeric"
								bind:value={submission.progress}
								placeholder={level ? `Minimum ${level.minProgress}%` : 'Minimum 0%'}
								class="col-span-3"
							/>
						</div>
					{:else}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Time</Label>
							<div class="flex gap-[10px]">
								<Input
									id="name"
									type="number"
									inputmode="numeric"
									bind:value={time.m}
									class="w-[75px]"
									placeholder="m"
								/>
								<Input
									id="name"
									type="number"
									inputmode="numeric"
									bind:value={time.s}
									class="w-[75px]"
									placeholder="s"
								/>
								<Input
									id="name"
									type="number"
									inputmode="numeric"
									bind:value={time.ms}
									class="w-[75px]"
									placeholder="ms"
								/>
							</div>
						</div>
					{/if}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">FPS</Label>
						<Input
							id="name"
							type="number"
							inputmode="numeric"
							bind:value={submission.refreshRate}
							placeholder="0 for CBF or unlimited FPS"
							class="col-span-3"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Video's link</Label>
						<Input id="name" bind:value={submission.videoLink} class="col-span-3" />
					</div>
					{#if !level || !level.flTop || level.rating}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name" class="text-right">Raw</Label>
							<Input id="name" bind:value={submission.raw} class="col-span-3" />
						</div>
					{/if}
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
				{/if}
				{#if step == 4}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Rating suggestion</Label>
						<Input
							id="name"
							type="number"
							inputmode="numeric"
							disabled={apiLevel.length != 'Plat' && submission.progress != 100}
							bind:value={submission.suggestedRating}
							placeholder={!(apiLevel.length != 'Plat' && submission.progress != 100)
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
				{/if}
			</div>
		{/if}
		<Dialog.Footer>
			<AlertDialog.Root>
				<AlertDialog.Trigger asChild let:builder>
					<div class="flex gap-[10px]">
						{#if step > 0}
							<Button
								class="w-full"
								on:click={() => {
									step--;
								}}
								variant="outline">Back</Button
							>
						{/if}
						{#if step == 4}
							<Button
								class="w-full"
								type="submit"
								builders={[builder]}
								on:click={() => {
									sendStatus = 0;
									submit();
								}}>Submit</Button
							>
						{:else}
							<Button class="w-full" on:click={next} bind:disabled={nextDisabled}>Next</Button>
						{/if}
					</div>
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
								{#if isSupporterActive($user.data.supporterUntil)}
									Your submission has been sent and <span class="text-yellow-500">prioritized!</span
									> It will be reviewed shortly.
								{:else}
									Your submission has been sent! It may take a few day for a moderator to approve
									your submission.
								{/if}
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
								We are unable to send your submission. If this problem persist, please contact a
								moderator to resolve this issue.<br />
								Error: {errorMessage}
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
