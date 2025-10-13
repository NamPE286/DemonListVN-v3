<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import * as Alert from '$lib/components/ui/alert';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { upload } from '$lib/client/storage';

	let state = 0;

	enum State {
		DEFAULT,
		NO_EVENT,
		NEW_EVENT,
		EDIT_EVENT
	}

	let event = {
		id: undefined,
		created_at: '',
		start: '',
		end: '',
		title: '',
		description: '',
		imgUrl: '',
		exp: NaN,
		content: '',
		redirect: null,
		minExp: 0,
		needProof: false,
		isSupporterOnly: false,
		isContest: false,
		hidden: false,
		freeze: '',
		isExternal: false,
		data: null,
		isRanked: false,
		isCalculated: false,
		priority: 0
	};

	function convertTime(x: string) {
		if (!x) {
			return '';
		}

		const d = new Date(x);
		d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

		return d.toISOString().slice(0, 16);
	}

	async function fetchEvent() {
		console.log(event.id);
		if (!event.id) {
			state = State.NEW_EVENT;
			return;
		}

		try {
			event = await (await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}`)).json();
			state = State.EDIT_EVENT;

			event.start = convertTime(event.start);
			event.end = convertTime(event.end);
			event.created_at = convertTime(event.created_at);
			event.freeze = convertTime(event.freeze);
		} catch {
			state = State.NO_EVENT;
		}
	}

	function validate() {
		const missing: string[] = [];

		if (!event.title || String(event.title).trim() === '') {
			missing.push('Title');
		}

		if (!event.description || String(event.description).trim() === '') {
			missing.push('Description');
		}

		const minExpRaw: any = event.minExp;

		if (minExpRaw === '' || minExpRaw === null || minExpRaw === undefined) {
			missing.push('Min EXP');
		} else if (isNaN(Number(minExpRaw))) {
			throw new Error('Min EXP must be a number');
		}

		const priorityRaw: any = event.priority;

		if (priorityRaw === '' || priorityRaw === null || priorityRaw === undefined) {
			missing.push('Priority');
		} else if (isNaN(Number(priorityRaw))) {
			throw new Error('Priority must be a number');
		}

		if (missing.length) {
			throw new Error(`Missing required fields: ${missing.join(', ')}`);
		}

		if (event.data && typeof event.data === 'string') {
			try {
				event.data = JSON.parse(event.data);
			} catch (e) {
				throw new Error('Data must be valid JSON');
			}
		}

		event.minExp = Number(event.minExp);
		event.priority = Number(event.priority);

		if (event.exp !== undefined && event.exp !== null) {
			event.exp = Number(event.exp);
		}

		if (event.created_at) {
			event.created_at = new Date(event.created_at).toISOString();
		} else {
			// @ts-ignore
			delete event.created_at;
		}

		if (event.start) {
			event.start = new Date(event.start).toISOString();
		} else {
			// @ts-ignore
			delete event.start;
		}

		if (event.end) {
			event.end = new Date(event.end).toISOString();
		} else {
			// @ts-ignore
			delete event.end;
		}

		if (event.freeze) {
			event.freeze = new Date(event.freeze).toISOString();
		} else {
			// @ts-ignore
			delete event.freeze;
		}
	}

	async function addEvent() {
		if (!confirm(`Add ${event.title} event?`)) {
			return;
		}

		try {
			validate();
		} catch (err: any) {
			toast.error(err.message);
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event`, {
				method: 'POST',
				body: JSON.stringify(event),
				headers: {
					Authorization: 'Bearer ' + (await $user.token()),
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					window.location.reload();

					return 'Event added!';
				},
				loading: 'Adding...',
				error: 'Failed to add'
			}
		);
	}

	async function editEvent() {
		if (!confirm(`Edit ${event.title} event?`)) {
			return;
		}

		try {
			validate();
		} catch (err: any) {
			toast.error(err.message);
			return;
		}

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}`, {
				method: 'PATCH',
				body: JSON.stringify(event),
				headers: {
					Authorization: 'Bearer ' + (await $user.token()),
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					window.location.reload();

					return 'Event edited!';
				},
				loading: 'Editing...',
				error: 'Failed to edit'
			}
		);
	}

	async function handleUpload(e: any) {
		const file: File | null = e.target.files[0];

		if (!file) {
			return;
		}

		const MAX_BYTES = 200 * 1024;
        
		if (file.size > MAX_BYTES) {
			toast.error('File must be 200 KB or smaller');

			try {
				e.target.value = '';
			} catch {}
			return;
		}

		if (!event.id) {
			toast.error('Event ID is required to upload');
			return;
		}

		const fileToUpload = new File([file], `${event.id}.webp`, {
			type: 'image/webp'
		});

		toast.promise(upload(`event-banner/${event.id}.webp`, fileToUpload, (await $user.token())!), {
			success: () => {
				window.location.reload();
				return 'Uploaded!';
			},
			loading: 'Uploading...',
			error: 'Failed to upload'
		});
	}
</script>

<Title value="Event manager" />

<div class="wrapper">
	<div class="input">
		<Label for="id" class="w-[100px]">Event's ID</Label>
		<Input
			bind:value={event.id}
			placeholder="Leave blank for new event"
			id="id"
			type="number"
			inputmode="numeric"
			class="w-[300px]"
		/>
		<Button on:click={fetchEvent}>Fetch</Button>
	</div>

	{#if state == State.NO_EVENT}
		<Alert.Root class="w-[500px]">
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description>No event found</Alert.Description>
		</Alert.Root>
	{:else if state == State.NEW_EVENT}
		<Alert.Root class="w-[500px]">
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description>Creating new event</Alert.Description>
		</Alert.Root>
	{/if}

	{#if state == State.NEW_EVENT || state == State.EDIT_EVENT}
		<div class="input mt-[50px]">
			<Label for="title" class="w-[100px]">Title</Label>
			<Input id="title" class="w-[300px]" placeholder="Required" bind:value={event.title} />
		</div>
		<div class="input">
			<Label for="created_at" class="w-[100px]">Created at</Label>
			<Input
				id="created_at"
				type="datetime-local"
				class="w-[300px]"
				placeholder="Required"
				bind:value={event.created_at}
			/>
			<span class="text-xs">default to now</span>
		</div>
		<div class="input">
			<Label for="start" class="w-[100px]">Start</Label>
			<Input
				id="start"
				type="datetime-local"
				class="w-[300px]"
				placeholder="Required"
				bind:value={event.start}
			/>
			<span class="text-xs">default to now</span>
		</div>
		<div class="input">
			<Label for="end" class="w-[100px]">End</Label>
			<Input id="end" type="datetime-local" class="w-[300px]" bind:value={event.end} />
			<span class="text-xs">null for permanent</span>
		</div>
		<div class="input">
			<Label for="description" class="w-[100px]">Description</Label>
			<Textarea
				id="description"
				class="w-[300px] rounded p-2"
				rows="3"
				placeholder="Required"
				bind:value={event.description}
			/>
		</div>
		<div class="input">
			<Label for="imgUrl" class="w-[100px]">Banner</Label>
			<Input id="imgUrl" class="w-[195px]" placeholder="image URL" bind:value={event.imgUrl} />
			or
			<input
				disabled={event.id === undefined}
				type="file"
				id="avatar"
				name="avatar"
				accept="image/webp"
				on:change={handleUpload}
			/>
			{#if event.id === undefined}
				<span class="text-xs">can be uploaded after the event is added</span>
			{/if}
		</div>
		<div class="input">
			<Label for="exp" class="w-[100px]">EXP</Label>
			<Input id="exp" type="number" step="1" class="w-[300px]" bind:value={event.exp} />
		</div>
		<div class="input">
			<Label for="minExp" class="w-[100px]">Min EXP</Label>
			<Input
				id="minExp"
				type="number"
				step="1"
				class="w-[300px]"
				placeholder="Required"
				bind:value={event.minExp}
			/>
		</div>
		<div class="input">
			<Label for="priority" class="w-[100px]">Priority</Label>
			<Input
				id="priority"
				type="number"
				step="1"
				class="w-[300px]"
				placeholder="Required"
				bind:value={event.priority}
			/>
		</div>
		<div class="input">
			<Label for="content" class="w-[100px]">Content</Label>
			<Textarea id="content" class="w-[300px] rounded p-2" rows="4" bind:value={event.content} />
		</div>
		<div class="input">
			<Label for="redirect" class="w-[100px]">Redirect</Label>
			<Input
				id="redirect"
				class="w-[300px]"
				placeholder="optional URL"
				bind:value={event.redirect}
			/>
		</div>
		<div class="input">
			<Label for="freeze" class="w-[100px]">Freeze</Label>
			<Input id="freeze" type="datetime-local" class="w-[300px]" bind:value={event.freeze} />
		</div>
		<div class="input">
			<Label for="data" class="w-[100px]">Data (JSON)</Label>
			<Textarea id="data" class="w-[300px] rounded p-2" rows="4" bind:value={event.data} />
		</div>
		<div class="input">
			<Label class="w-[100px]">Need proof</Label>
			<Switch bind:checked={event.needProof} />
		</div>
		<div class="input">
			<Label class="w-[100px]">Supporter only</Label>
			<Switch bind:checked={event.isSupporterOnly} />
		</div>
		<div class="input">
			<Label class="w-[100px]">Contest</Label>
			<Switch bind:checked={event.isContest} />
		</div>
		<div class="input">
			<Label class="w-[100px]">Hidden</Label>
			<Switch bind:checked={event.hidden} />
		</div>
		<div class="input">
			<Label class="w-[100px]">External</Label>
			<Switch bind:checked={event.isExternal} />
		</div>
		<div class="input">
			<Label class="w-[100px]">Ranked</Label>
			<Switch bind:checked={event.isRanked} />
		</div>
		<div class="input">
			<Label class="w-[100px]">Calculated</Label>
			<Switch bind:checked={event.isCalculated} />
		</div>
		<div class="input mt-[20px]">
			{#if state == State.NEW_EVENT}
				<Button on:click={addEvent}>Add</Button>
			{:else if state == State.EDIT_EVENT}
				<Button on:click={editEvent}>Edit</Button>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		padding-inline: 75px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.input {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
