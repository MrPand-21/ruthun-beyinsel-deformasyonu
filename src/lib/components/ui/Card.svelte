<script lang="ts">
    const { title = "", className = "", desc = "", children } = $props();
</script>

<div
    class={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 ${className}`}
>
    {#if children}
        {@render children()}
    {/if}
</div>
