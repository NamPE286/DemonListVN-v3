<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Autoplay from 'embla-carousel-autoplay';
</script>

<svelte:head>
	<title>Store - Demon List VN</title>
</svelte:head>

<div
	class="mb-[50px] ml-auto mr-auto mt-[30px] flex w-[1200px] max-w-full items-center pl-[15px] pr-[15px]"
>
	<h2>Store</h2>
	<Button class="ml-auto">View my cart (1)</Button>
</div>

<div class="flex flex-col items-center gap-[10px] pl-[10px] pr-[10px]">
	<Carousel.Root
		class="w-[1200px] max-w-full"
		plugins={[
			Autoplay({
				delay: 10000
			})
		]}
	>
		<Carousel.Content>
			{#each { length: 5 } as _}
				<Carousel.Item>
					<a href="#!">
						<img
							class="ml-auto mr-auto aspect-[3/1] min-h-[250px] w-[1200px] max-w-full rounded-xl object-cover"
							src="https://static.vecteezy.com/system/resources/previews/020/933/072/non_2x/abstract-blur-gradient-background-vector.jpg"
							alt="product"
						/>
					</a>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
	<h3 class="text-[25px] font-medium">All products</h3>
	<div class="flex w-[1200px] max-w-full flex-wrap justify-center gap-[10px]">
		{#each { length: 10 } as _}
			<a href="#!">
				<div class="rounded-xl p-[10px] hover:bg-[hsl(var(--muted))]">
					<img
						class=" h-[180px] w-[180px] rounded-xl object-cover"
						src="https://static.vecteezy.com/system/resources/previews/020/933/072/non_2x/abstract-blur-gradient-background-vector.jpg"
						alt="product"
					/>
					<div class="p-[7.5px] pb-0">
						<h4 class="font-bold">Product's name</h4>
						<h4>10.000₫</h4>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	h2 {
		font-weight: 600;
		font-size: 35px;
	}
</style>
