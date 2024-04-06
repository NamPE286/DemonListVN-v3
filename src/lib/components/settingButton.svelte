<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
    import { setMode } from 'mode-watcher';
	import Gear from 'svelte-radix/Gear.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Desktop from 'svelte-radix/Desktop.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
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
		<div class="setting">
			<Label>Theme</Label>
			<div class="right">
				<Tooltip.Root>
					<Tooltip.Trigger let:builder>
						<Button builders={[builder]} variant="outline" size="icon" on:click={() => setMode('system')}>
							<Desktop class="h-[1.2rem] w-[1.2rem]" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>System</p>
					</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger let:builder>
						<Button builders={[builder]} variant="outline" size="icon" on:click={() => setMode('light')}>
							<Sun class="h-[1.2rem] w-[1.2rem]" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Light</p>
					</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger let:builder>
						<Button builders={[builder]} variant="outline" size="icon" on:click={() => setMode('dark')}>
							<Moon class="h-[1.2rem] w-[1.2rem]" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Dark</p>
					</Tooltip.Content>
				</Tooltip.Root>
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
