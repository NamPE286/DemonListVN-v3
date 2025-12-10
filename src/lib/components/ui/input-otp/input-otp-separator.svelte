<script>
	import Minus from "@lucide/svelte/icons/minus";

	let {
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<div bind:this={ref} role="separator" {...restProps}>
	{#if children}
		{@render children?.()}
	{:else}
		<Minus />
	{/if}
</div>