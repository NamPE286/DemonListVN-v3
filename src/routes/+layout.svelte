<script>
	import '../app.scss';
	import 'non.geist'

	const links = [
		{
			route: '/DL',
			name: 'Demon List'
		}
	];
</script>

<div class="navbarWrapper">
	<a href="/">
		<img src="/favicon.png" alt="logo" />
		<span><b>Demon List VN</b></span>
	</a>
</div>

<slot />

<style lang="scss">
	.navbarWrapper {
		height: 50px;
		background-color: var(--bg0);
		overflow: hidden;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-inline: 30px;
		border-bottom: 1px solid var(--borderColor);

		.imgWrapper {
			max-width: 100%;
		}

		img {
			filter: invert(1);
			max-height: 22px;
			max-width: 22px;
		}

		a {
			color: var(--textColor);
			text-decoration: none;
			display: flex;
			align-items: center;
			gap: 10px;
		}
	}
</style>
