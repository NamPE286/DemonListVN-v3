<script lang="ts">
	export let medal: any;
	console.log(medal.medalID);
</script>

<div class="flex flex-col items-center w-[200px] hover:bg-[hsl(var(--secondary))] p-[15px] rounded-xl transition duration-200 ease-in-out">
    <img
        class="h-[150px] w-[150px] object-cover"
        src={`https://qdwpenfblwdmhywwszzj.supabase.co/storage/v1/object/public/medals/${medal.medalID}.webp`}
        alt=""
    />
    <h3 class="font-bold text-xl mt-[10px] mb-[10px] text-center">{medal.name}</h3>
    {#if medal.content}
        <p class='text-center'>{medal.content}</p>
    {/if}
    <p class='text-[var(--textColor2)] mt-[10px]'>Achieved on {new Date(medal.created_at).toLocaleDateString('vi-vn')}</p>
</div>
