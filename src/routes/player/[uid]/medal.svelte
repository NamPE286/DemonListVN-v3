<script lang="ts">
	export let medal: any;
</script>

<a href={medal.redirect ? medal.redirect : "#!"}>
	<div
		class="flex w-[200px] flex-col items-center rounded-xl p-[15px] transition duration-200 ease-in-out hover:bg-[hsl(var(--secondary))]"
	>
		<img
			class="h-[150px] w-[150px] object-cover"
			src={`https://qdwpenfblwdmhywwszzj.supabase.co/storage/v1/object/public/medals/${medal.medalID}.webp`}
			alt=""
		/>
		<h3 class="mb-[10px] mt-[10px] text-center text-xl font-bold">{medal.name}</h3>
		{#if medal.content}
			<p class="text-center">{medal.content}</p>
		{/if}
		<p class="mt-[10px] text-[var(--textColor2)]">
			Achieved on {new Date(medal.created_at).toLocaleDateString('vi-vn')}
		</p>
	</div>
</a>
