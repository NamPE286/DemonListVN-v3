<script>
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		errorClasses,
		children: childrenProp,
		...restProps
	} = $props();
</script>

<FormPrimitive.FieldErrors
	class={cn("text-destructive text-[0.8rem] font-medium", className)}
	{...restProps}
>
	{#snippet children({ errors, errorProps })}
		{#if childrenProp}
			{@render childrenProp({ errors, errorProps })}
		{:else}
			{#each errors as error (error)}
				<div {...errorProps} class={cn(errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>