<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import * as Alert from '$lib/components/ui/alert';
	import { user } from '$lib/client';

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

	async function fetchEvent() {
		if (!event.id) {
			state = State.NEW_EVENT;
			return;
		}

		try {
			event = await (await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}`)).json();
			state = State.EDIT_EVENT;

			console.log(event);
		} catch {
			state = State.NO_EVENT;
		}
	}
</script>

<Title value="Event manager" />

<div class="wrapper">
	<div class="input">
		<Label for="id" class="w-[100px]">Event's ID</Label>
		<Input
			placeholder="Leave blank for new event"
			id="id"
			type="number"
			inputmode="numeric"
			class="w-[300px]"
		/>
		<Button on:click={fetchEvent} bind:value={event.id}>Fetch</Button>
	</div>

	{#if state == State.NO_EVENT}
		<Alert.Root class="w-[500px]">
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description>No event found</Alert.Description>
		</Alert.Root>
	{:else if state == State.NEW_EVENT}
		<Alert.Root class="w-[500px]">
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description>Will create new event</Alert.Description>
		</Alert.Root>
	{/if}

	{#if state == State.NEW_EVENT || state == State.EDIT_EVENT}
		<div class="input mt-[50px]">
			<Label for="title" class="w-[100px]">Title</Label>
			<Input
				id="title"
				class="w-[300px]"
				placeholder="Required"
				required
				bind:value={event.title}
			/>
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
			<span class="text-xs">Required</span>
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
			<span class="text-xs">Required</span>
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
			<Label for="imgUrl" class="w-[100px]">Image URL</Label>
			<Input id="imgUrl" class="w-[300px]" placeholder="https://..." bind:value={event.imgUrl} />
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
			<Button
				on:click={async () => {
					try {
						const method = event.id ? 'PUT' : 'POST';
						const url = `${import.meta.env.VITE_API_URL}/event${event.id ? `/${event.id}` : ''}`;
						const body = JSON.stringify(event);
						const res = await fetch(url, {
							method,
							headers: { 'Content-Type': 'application/json' },
							body
						});
						if (!res.ok) {
							console.error('Save failed', await res.text());
							return;
						}
						event = await res.json();
						state = State.EDIT_EVENT;
					} catch (e) {
						console.error(e);
					}
				}}
			>
				Save
			</Button>

			{#if state == State.EDIT_EVENT}
				<Button
					variant="destructive"
					on:click={async () => {
						try {
							const res = await fetch(`${import.meta.env.VITE_API_URL}/event/${event.id}`, {
								method: 'DELETE'
							});
							if (!res.ok) {
								console.error('Delete failed', await res.text());
								return;
							}
							event = {
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
								isSupporterOnly: true,
								isContest: false,
								hidden: false,
								freeze: '',
								isExternal: false,
								data: null,
								isRanked: false,
								isCalculated: false,
								priority: 0
							};
							state = State.NEW_EVENT;
						} catch (e) {
							console.error(e);
						}
					}}
				>
					Delete
				</Button>
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
