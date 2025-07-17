<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Store - Demon List VN</title>
</svelte:head>

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[1200px] max-w-full items-center pl-[10px] pr-[10px]"
>
	<h2>Store</h2>
	<Button class="ml-auto">View my cart (1)</Button>
</div>

<div class="flex flex-col items-center gap-[10px]">
	<div class="h-[350px] w-[1200px]">
		<img
			class="h-full w-full rounded-xl object-cover"
			src="https://static.vecteezy.com/system/resources/previews/020/933/072/non_2x/abstract-blur-gradient-background-vector.jpg"
			alt="product"
		/>
	</div>
	<h3 class="text-[25px] font-medium">Other products</h3>
	<div class="flex w-[1200px] flex-wrap justify-center gap-[10px]">
		{#each Array(10) as item, index}
			<div class="border-box rounded-xl p-[10px] hover:bg-[hsl(var(--muted))]">
				<img
					class=" h-[200px] w-[200px] rounded-xl object-cover"
					src="https://static.vecteezy.com/system/resources/previews/020/933/072/non_2x/abstract-blur-gradient-background-vector.jpg"
					alt="product"
				/>
				<div class="border-box p-[10px] pb-0">
					<h4 class="font-bold">Product's name</h4>
					<h4>10.000₫</h4>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	h2 {
		font-weight: 600;
		font-size: 35px;
	}
</style>
