<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    const { isOpen, onClose, className, children } = $props();

    let dropdownRef: HTMLDivElement;

    function handleClickOutside(event: MouseEvent) {
        if (
            dropdownRef &&
            !dropdownRef.contains(event.target as Node) &&
            !(event.target as HTMLElement).closest(".dropdown-toggle")
        ) {
            onClose();
        }
    }

    onMount(() => {
        document.addEventListener("mousedown", handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener("mousedown", handleClickOutside);
    });
</script>

{#if isOpen}
    <div
        bind:this={dropdownRef}
        class="absolute z-40 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark {className}"
    >
        {@render children()}
    </div>
{/if}
