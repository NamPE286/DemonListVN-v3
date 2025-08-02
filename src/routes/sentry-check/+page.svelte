<script lang="ts">
	let a: any = 1;
</script>

<button on:click={() => {
    console.log(a.b.c)
}}> Test </button>
