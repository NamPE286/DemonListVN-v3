<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { setMode } from 'mode-watcher';
	import { toast } from "svelte-sonner";
	import { settings } from '$lib/client/settings';
	import Gear from 'svelte-radix/Gear.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Desktop from 'svelte-radix/Desktop.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	const settingsValue = settings.value
	let bgURL = $settingsValue.dashboardBackgroundURL
	let bgURLOpened = false
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
			<Dialog.Description>Some settings require page refresh to take effect</Dialog.Description>
		</Dialog.Header>
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
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="bgURL" class="text-right">Image URL</Label>
								<Input id="bgURL" bind:value={bgURL} class="col-span-3" />
							</div>
						</Dialog.Header>
						<Dialog.Footer>
							<Button type="submit" on:click={() => {
								console.log(bgURL)
								settings.set('dashboardBackgroundURL', bgURL)
								toast.success('Changed background image!')
								bgURLOpened = false
							}}>Apply</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.setting {
		display: flex;
		align-items: center;

		.right {
			margin-left: auto;
		}
	}
</style>
