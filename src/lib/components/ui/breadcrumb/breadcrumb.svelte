<script>
	let {
		ref = $bindable(),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<nav class={className} bind:this={ref} aria-label="breadcrumb" {...restProps}>
	{@render children?.()}
</nav>