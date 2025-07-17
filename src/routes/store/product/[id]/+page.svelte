<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Markdown from '$lib/components/markdown.svelte';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	let selectedImageIndex = 0;
	let quantity = 1;

	function selectImage(index: number) {
		selectedImageIndex = index;
	}

	function addToCart() {
		toast.success('Added to cart!');
	}
</script>

<svelte:head>
	<title>{data.name} - Demon List VN</title>
</svelte:head>

<div
	class="ml-auto mr-auto mt-[20px] flex w-[1300px] max-w-full flex-col items-center gap-[20px] md:gap-[50px] pl-[15px] pr-[15px] md:mt-[50px] lg:flex-row lg:items-start"
>
	<div class="flex w-fit flex-col gap-[10px]">
		<img
			class="aspect-square w-[500px] rounded-2xl object-cover"
			src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/products/${data.id}/${selectedImageIndex}.webp`}
			alt="product"
		/>
		<div class="flex justify-center gap-[10px]">
			{#each { length: data.imgCount } as _, index}
				<button
					class="h-[75px] w-[75px] overflow-hidden rounded-lg border-2 transition-all duration-200
                    {selectedImageIndex === index
						? 'scale-105 border-blue-500'
						: 'border-gray-300 hover:border-gray-400'}"
					on:click={() => selectImage(index)}
				>
					<img
						class="h-full w-full object-cover"
						src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/products/${data.id}/${index}.webp`}
						alt="product thumbnail {index + 1}"
					/>
				</button>
			{/each}
		</div>
	</div>
	<div class="flex flex-col items-center gap-[20px] lg:items-start">
		<div>
			<h2 class="text-center text-[30px] font-semibold lg:text-left">{data.name}</h2>
			<h3 class="text-center text-[21px] lg:text-left">
				{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
			</h3>
		</div>
		<Markdown content={data.description} />
		<div class="mt-auto flex flex-col gap-[15px]">
			<div class="flex items-center gap-[8px]">
				<Label for="quantity" class="text-[16px] font-medium">Quantity</Label>
				<div class="flex items-center gap-[10px]">
					<Button
						variant="outline"
						size="sm"
						on:click={() => quantity--}
						disabled={quantity <= 1}
						class="h-[40px] w-[40px] p-0"
					>
						-
					</Button>
					<Input
						id="quantity"
						type="number"
						bind:value={quantity}
						min="1"
						class="h-[40px] w-[80px] text-center"
					/>
					<Button
						variant="outline"
						size="sm"
						disabled={quantity == data.maxQuantity}
						on:click={() => quantity++}
						class="h-[40px] w-[40px] p-0"
					>
						+
					</Button>
				</div>
			</div>
			<Button on:click={addToCart} class="h-[50px] w-[260px] text-[16px] font-semibold" size="lg">
				Add to Cart
			</Button>
		</div>
	</div>
</div>
