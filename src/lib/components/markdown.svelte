<script lang="ts">
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';

	export let content: string;

	function updateMarkdownStyle() {
		const elem = document.getElementsByClassName('markdown')[0];

		if (elem) {
			const links = elem.getElementsByTagName('a');
			for (const link of links) {
				link.style.color = '#98c2fe';
			}
		}
	}

	onMount(() => {
		updateMarkdownStyle();
	});

</script>

<SvelteMarkdown source={content} />
