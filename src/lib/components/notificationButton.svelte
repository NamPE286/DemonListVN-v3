<script lang="ts">
	import { Bell } from 'svelte-radix';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator';

	let isEmpty = true;
</script>

<Popover.Root>
	<Popover.Trigger>
		<button class="clickable">
			<Button variant="icon" size="icon">
				<Bell size={20} />
			</Button>
		</button>
	</Popover.Trigger>
	<Popover.Content class="w-[350px]">
		<div class="header">
			<h4 class="font-medium leading-none">Notifications</h4>
			<div class="buttonWrapper">
				<Button variant="link">Clear all</Button>
			</div>
		</div>
		{#if isEmpty}
			<p class="noNoti">No notification</p>
		{:else}
			<Separator />
			<div class="notifications">
				<ScrollArea class="h-[300px]"></ScrollArea>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>

<style lang="scss">
	.header {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.buttonWrapper {
		margin-left: auto;
	}

	.notifications {
		margin-top: 10px;
	}

	.noNoti {
		color: var(--textColor2);
		text-align: center;
		font-size: 14px;
	}
</style>
