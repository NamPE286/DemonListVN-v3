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
	import Gear from 'svelte-radix/Gear.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Desktop from 'svelte-radix/Desktop.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { isActive } from '$lib/client/isSupporterActive';

	const settingsValue = settings.value;
	let bgURLOpened = false;
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

	$: ($user, fetchAPIKeys());
</script>

<Dialog.Root>
	<Dialog.Trigger let:builder>
		<Button builders={[builder]} variant="outline" size="icon">
			<Gear class="h-[1.2rem] w-[1.2rem]" />
			<span class="sr-only">Settings</span>
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
		</Dialog.Header>
		<Tabs.Root value="general">
			<Tabs.List>
				<Tabs.Trigger value="general">General</Tabs.Trigger>
				<Tabs.Trigger value="api">API</Tabs.Trigger>
				<Tabs.Trigger value="sub">Subscriptions</Tabs.Trigger>
				<Tabs.Trigger value="discord">Discord</Tabs.Trigger>
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
								<Table.Cell>{new Date(key.created_at).toLocaleString('vi-VN')}</Table.Cell>
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
			<Tabs.Content value="sub">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[120px]">Name</Table.Head>
							<Table.Head>Active Untils</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							{#if $user.loggedIn}
								<Table.Cell class="font-medium">Supporter Role</Table.Cell>
								{#if $user.data.supporterUntil == null}
									<Table.Cell>Not activated</Table.Cell>
								{:else}
									<Table.Cell
										>{new Date($user.data.supporterUntil).toLocaleString('vi-VN')}
										{isActive($user.data.supporterUntil) ? '' : '(Expired)'}</Table.Cell
									>
								{/if}
							{/if}
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Tabs.Content>
			<Tabs.Content value="discord">
				{#if $user.loggedIn}
					{#if $user.data.discord}
						<Button class="w-full" variant="outline" disabled>Linked</Button>
					{:else}
						<a
							href="https://discord.com/oauth2/authorize?client_id=1071500325338488843&response_type=code&redirect_uri=https%3A%2F%2Fapi.demonlistvn.com%2Fauth%2Fcallback%2Fdiscord&scope=identify"
						>
							<Button class="w-full" variant="outline">Link account</Button>
						</a>
					{/if}
				{/if}
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
