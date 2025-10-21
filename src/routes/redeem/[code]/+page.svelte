<script lang="ts">
	import { page } from '$app/state';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Gift, Calendar, Package, Percent } from 'lucide-svelte';
	import Loading from '$lib/components/animation/loading.svelte';

	let data: any = null;
	let loading = true;
	let claiming = false;
	let claimed = false;
	let showContent = false;

	onMount(async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/coupon/${page.params.code}`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + (await $user.token())
				}
			});
			data = await response.json();
			console.log(data);
		} catch (error) {
			console.error('Error fetching coupon:', error);
		} finally {
			loading = false;

			setTimeout(() => {
				showContent = true;
			}, 50);
		}
	});

	async function claimGift() {
		claiming = true;
		try {
			// Add your claim API call here
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/coupon/${page.params.code}/claim`,
				{
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + (await $user.token())
					}
				}
			);

			if (response.ok) {
				claimed = true;
			}
		} catch (error) {
			console.error('Error claiming gift:', error);
		} finally {
			claiming = false;
		}
	}

	function getTimeLeft(validUntil: string) {
		const now = new Date();
		const endDate = new Date(validUntil);
		const timeDiff = endDate.getTime() - now.getTime();

		if (timeDiff <= 0) {
			return 'Đã hết hạn';
		}

		const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

		if (days > 0) {
			return `${days} ngày ${hours} giờ`;
		} else if (hours > 0) {
			return `${hours} giờ ${minutes} phút`;
		} else {
			return `${minutes} phút`;
		}
	}
</script>

{#if loading}
	<div class="mt-[40px] flex items-center justify-center" style="height: calc(100vh - 150px)">
		<div class="flex items-center justify-center py-20">
			<Loading inverted={true} />
		</div>
	</div>
{:else if data && data.percent == 1}
	<div class="mt-[40px] flex items-center justify-center" style="height: calc(100vh - 150px)">
		<Card.Root class="mx-auto w-full max-w-[600px] overflow-hidden border-0 shadow-2xl">
			<div class="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-[2px]">
				<Card.Content
					class="bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-red-900/90 p-0 backdrop-blur-sm"
				>
					<div
						class="p-8 text-white transition-opacity duration-700 {showContent
							? 'opacity-100'
							: 'opacity-0'}"
					>
						<!-- Gift Icon Header -->
						<div class="mb-6 flex justify-center">
							<div class="rounded-full bg-white/20 p-6 backdrop-blur-sm">
								<Gift class="h-16 w-16 animate-pulse text-white" />
							</div>
						</div>

						<!-- Title -->
						<h1 class="mb-2 text-center text-3xl font-bold">
							{claimed ? '🎉 Đã Nhận Quà!' : 'Bạn Có Một Món Quà!'}
						</h1>
						<p class="mb-8 text-center text-white/80">
							{claimed
								? 'Quà tặng đã được thêm vào tài khoản của bạn'
								: 'Nhấn nút bên dưới để nhận quà'}
						</p>

						<!-- Gift Details -->
						<div class="mb-8 space-y-4 rounded-lg bg-white/10 p-6 backdrop-blur-md">
							<div class="flex items-center gap-3">
								<Package class="h-5 w-5 text-purple-300" />
								<div class="flex-1">
									<p class="text-sm text-white/70">Sản phẩm</p>
									<p class="text-lg font-semibold">{data.products.name} ({data.quantity} ngày)</p>
								</div>
							</div>

							<div class="flex items-center gap-3">
								<Calendar class="h-5 w-5 text-yellow-300" />
								<div class="flex-1">
									<p class="text-sm text-white/70">Thời gian còn lại</p>
									<p class="font-semibold">{getTimeLeft(data.validUntil)}</p>
								</div>
							</div>
						</div>

						<!-- Gift Code -->
						<div class="mb-8 text-center">
							<p class="mb-2 text-sm text-white/70">Mã quà tặng</p>
							<div class="inline-block rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
								<code class="font-mono text-2xl font-bold tracking-wider">{page.params.code}</code>
							</div>
						</div>

						<!-- Claim Button -->
						{#if !claimed}
							<Button
								on:click={claimGift}
								disabled={claiming || data.usageLeft <= 0}
								class="w-full transform rounded-lg bg-white py-6 text-lg font-bold text-purple-900 shadow-lg transition-all hover:scale-105 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
							>
								{#if claiming}
									<span>Đang nhận...</span>
								{:else if data.usageLeft <= 0}
									Quà đã hết
								{:else}
									Nhận Quà Ngay
								{/if}
							</Button>
						{:else}
							<div class="rounded-lg border-2 border-green-400 bg-green-500/20 p-4 text-center">
								<p class="font-semibold text-green-300">✓ Đã nhận quà thành công!</p>
							</div>
						{/if}
					</div>
				</Card.Content>
			</div>
		</Card.Root>
	</div>
{:else}
	<div
		class="mt-[40px] flex flex-col items-center justify-center"
		style="height: calc(100vh - 150px)"
	>
		<p class="text-xl">❌ Không tìm thấy mã quà tặng</p>
		<p class="mt-2 text-white/70">Vui lòng kiểm tra lại mã của bạn</p>
	</div>
{/if}
