<script lang="ts">
    import type { Nullable } from "$lib/types";
    import { onMount } from "svelte";

    let {
        isOpen = $bindable(),
        onClose,
        className,
        title,
        children,
    } = $props();

    let dropdownRef: Nullable<HTMLDivElement> = $state(null);

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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<h3
    onclick={() => {
        isOpen = !isOpen;
    }}
    class="p-2 text-lg font-semibold"
>
    {title}
</h3>
{#if isOpen}
    <div
        bind:this={dropdownRef}
        aria-invalid={isOpen}
        class="rounded-xl border border-gray-200 shadow-theme-lg dark:border-gray-800 {className}"
    >
        {@render children()}
    </div>
{/if}
