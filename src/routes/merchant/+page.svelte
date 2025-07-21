<script lang="ts">
	import Title from '$lib/components/Title.svelte';
</script>

<Title value="Merchant" />

<div class="wrapper">
	<a href="/merchant/orders">Orders</a><br />
</div>

<style lang="scss">
	a {
		color: #7cb4f8;
	}

	.wrapper {
		padding-inline: 75px;
	}
</style>
