<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button/index.js';
	import { user } from '$lib/client';
	import { setMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { settings } from '$lib/client/settings';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import Gear from 'svelte-radix/Gear.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Desktop from 'svelte-radix/Desktop.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	const settingsValue = settings.value;
	let bgURL = $settingsValue.dashboardBackgroundURL;
	let bgURLOpened = false;
	let hideDiscord = $settingsValue.hideDiscord == 'true';
	let APIKeys: any[] = [];

	async function fetchAPIKeys() {
		if (!$user.loggedIn) {
			return;
		}

		APIKeys = await (
			await fetch(`${import.meta.env.VITE_API_URL}/APIKey`, {
				headers: {
					Authorization: 'Bearer ' + (await $user.token())!
				}
			})
		).json();
	}

	async function copyToClipboard(value: string) {
		await navigator.clipboard.writeText(value);
		toast.success('Copied API key to clipboard!');
	}

	async function createNewKey() {
		await fetch(`${import.meta.env.VITE_API_URL}/APIKey`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + (await $user.token())!
			}
		});

		toast.success('Created a new API key!');
		fetchAPIKeys();
	}

	async function deleteKey(key: string) {
		await fetch(`${import.meta.env.VITE_API_URL}/APIKey/${key}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + (await $user.token())!
			}
		});

		toast.success('Key deleted!');
		fetchAPIKeys();
	}

	$: $user, fetchAPIKeys();
</script>

<Dialog.Root>
	<Dialog.Trigger let:builder>
		<Button builders={[builder]} variant="outline" size="icon">
			<Gear class="h-[1.2rem] w-[1.2rem]" />
			<span class="sr-only">Setting</span>
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Setting</Dialog.Title>
		</Dialog.Header>
		<Tabs.Root value="general">
			<Tabs.List>
				<Tabs.Trigger value="general">General</Tabs.Trigger>
				<Tabs.Trigger value="api">API</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="general">
				<div class="setting">
					<Label>Theme</Label>
					<div class="right">
						<Tooltip.Root>
							<Tooltip.Trigger let:builder>
								<Button
									builders={[builder]}
									variant="outline"
									size="icon"
									on:click={() => setMode('system')}
								>
									<Desktop class="h-[1.2rem] w-[1.2rem]" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>System</p>
							</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger let:builder>
								<Button
									builders={[builder]}
									variant="outline"
									size="icon"
									on:click={() => setMode('light')}
								>
									<Sun class="h-[1.2rem] w-[1.2rem]" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>Light</p>
							</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger let:builder>
								<Button
									builders={[builder]}
									variant="outline"
									size="icon"
									on:click={() => setMode('dark')}
								>
									<Moon class="h-[1.2rem] w-[1.2rem]" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>Dark</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				</div>
				<div class="setting">
					<Label>Background image</Label>
					<div class="right">
						<Dialog.Root bind:open={bgURLOpened}>
							<Dialog.Trigger let:builder>
								<Button variant="outline" builders={[builder]}>Change</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Change background image</Dialog.Title>
									<Dialog.Description>Leave blank to disable</Dialog.Description>
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="bgURL" class="text-right">Image URL</Label>
										<Input id="bgURL" bind:value={bgURL} class="col-span-3" />
									</div>
								</Dialog.Header>
								<Dialog.Footer>
									<Button
										type="submit"
										on:click={() => {
											settings.set('dashboardBackgroundURL', bgURL);
											toast.success('Changed background image!');
											bgURLOpened = false;
										}}>Apply</Button
									>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</div>
				</div>
				<div class="setting">
					<Label for="discord">Hide Discord invite</Label>
					<Switch
						class="ml-auto"
						id="discord"
						bind:checked={hideDiscord}
						on:click={() => {
							settings.set('hideDiscord', hideDiscord ? 'false' : 'true');
						}}
					/>
				</div>
			</Tabs.Content>
			<Tabs.Content value="api">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[70px]">Key</Table.Head>
							<Table.Head>Created at</Table.Head>
							<Table.Head class="text-right"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each APIKeys as key}
							<Table.Row>
								<Table.Cell class="font-medium" on:click={() => {}}>
									<button on:click={() => copyToClipboard(key.key)} class="w-[50px] truncate">
										{key.key}
									</button>
								</Table.Cell>
								<Table.Cell>{new Date(key.created_at).toLocaleString()}</Table.Cell>
								<Table.Cell class="text-right">
									<AlertDialog.Root>
										<AlertDialog.Trigger asChild let:builder>
											<Button variant="destructive" size="icon" builders={[builder]}
												><Trash size={20} /></Button
											>
										</AlertDialog.Trigger>
										<AlertDialog.Content>
											<AlertDialog.Header>
												<AlertDialog.Title>Are you sure?</AlertDialog.Title>
												<AlertDialog.Description>
													This action cannot be undone.
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
												<AlertDialog.Action on:click={() => deleteKey(key.key)}
													>Continue</AlertDialog.Action
												>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
				<AlertDialog.Root>
					<AlertDialog.Trigger asChild let:builder>
						<Button builders={[builder]} class="mt-[10px] w-full" variant="outline"
							>Create a new key</Button
						>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Create a new API key?</AlertDialog.Title>
							<AlertDialog.Description>
								Anyone with this key can submit and make change to your account.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action on:click={createNewKey}>Continue</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.setting {
		display: flex;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 10px;

		.right {
			margin-left: auto;
		}
	}
</style>
