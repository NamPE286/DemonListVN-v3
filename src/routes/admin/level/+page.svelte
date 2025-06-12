<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import * as Alert from '$lib/components/ui/alert';
	import { user } from '$lib/client';

	let state = 0;
	let level = {
		id: NaN,
		name: '',
		creator: '',
		videoID: '',
		minProgress: NaN,
		flTop: NaN,
		rating: NaN,
		isPlatformer: false
	};

	async function fetchLevel() {
		fetch(`${import.meta.env.VITE_API_URL}/level/${level.id}`)
			.then((res) => res.json())
			.then((res) => {
				level = res;
				state = 1;
			})
			.catch((err) => {
				fetch(`https://gdbrowser.com/api/level/${level.id}`)
					.then((res) => res.json())
					.then((res) => {
						level.name = res.name;
						level.creator = res.author;
						state = 2;
					})
					.catch((err) => (state = 3));
			});
	}

	async function updateLevel() {
		if(!level.isPlatformer) {
			console.log('ok')
			level.isPlatformer = false;
		}

		for (const i in level) {
			// @ts-ignore
			if (level[i] === '') {
				// @ts-ignore
				level[i] = null;
			}
		}

		fetch(`${import.meta.env.VITE_API_URL}/level`, {
			method: 'PUT',
			body: JSON.stringify(level),
			headers: {
				Authorization: `Bearer ${await $user.token()}`,
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			if (!res.ok) {
				alert('An error occured');
				return;
			}

			alert('Success!');
			window.location.reload();
		});
	}

	async function deleteLevel() {
		if (!confirm("This level and all of it's record will be deleted. Proceed?")) {
			return;
		}

		fetch(`${import.meta.env.VITE_API_URL}/level/${level.id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${await $user.token()}`
			}
		}).then((res) => {
			if (!res.ok) {
				alert('An error occured');
				return;
			}

			alert('Success!');
			window.location.reload();
		});
	}
</script>

<Title value="Level manager" />

<div class="wrapper">
	<div class="input">
		<Label for="id" class="w-[100px]">Level's ID</Label>
		<Input id="id" type="number" inputmode="numeric" class="w-[300px]" bind:value={level.id} />
		<Button on:click={fetchLevel}>Fetch</Button>
	</div>
	{#if state == 2}
		<Alert.Root class="w-[500px]">
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description
				>No level found in DLVN but exist on GD server. Some detail has been autofilled for you.</Alert.Description
			>
		</Alert.Root>
	{/if}
	{#if state == 3}
		<Alert.Root class="w-[500px]">
			<Alert.Title>Attention!</Alert.Title>
			<Alert.Description
				>No level found on GD server. Please recheck the level's ID.</Alert.Description
			>
		</Alert.Root>
	{/if}
	{#if state == 1 || state == 2}
		<div class="input mt-[50px]">
			<Label for="name" class="w-[100px]">Name</Label>
			<Input id="name" class="w-[300px]" placeholder="Required" required bind:value={level.name} />
		</div>
		<div class="input">
			<Label for="creator" class="w-[100px]">Creator</Label>
			<Input
				id="creator"
				class="w-[300px]"
				placeholder="Required"
				required
				bind:value={level.creator}
			/>
		</div>
		<div class="input">
			<Label for="videoID" class="w-[100px]">Video ID</Label>
			<Input
				id="videoID"
				class="w-[300px]"
				placeholder="Required"
				required
				bind:value={level.videoID}
			/>
		</div>
		<div class="input">
			<Label for="flTop" class="w-[100px]">FL Top</Label>
			<Input
				id="flTop"
				type="number"
				inputmode="numeric"
				class="w-[300px]"
				bind:value={level.flTop}
			/>
		</div>
		<div class="input">
			<Label for="minProgress" class="w-[100px]">Minimum progress</Label>
			<Input
				id="minProgress"
				type="number"
				inputmode="numeric"
				class="w-[300px]"
				placeholder="Required"
				required
				bind:value={level.minProgress}
			/>
		</div>
		<div class="input">
			<Label for="rating" class="w-[100px]">Rating</Label>
			<Input
				id="rating"
				type="number"
				inputmode="numeric"
				class="w-[300px]"
				bind:value={level.rating}
			/>
		</div>
		<div class="input">
			<Label for="rating" class="w-[100px]">Platformer</Label>
			<Switch bind:checked={level.isPlatformer}></Switch>
		</div>
		<div class="flex w-[150px] flex-col gap-[15px]">
			<Button on:click={updateLevel}>{state == 1 ? 'Update' : 'Add new level'}</Button>
			{#if state == 1}
				<Button on:click={deleteLevel} variant="destructive" class="mt-[100px]">Delete</Button>
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
