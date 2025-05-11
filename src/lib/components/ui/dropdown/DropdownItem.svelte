<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let tag: "a" | "button" = "button";
    export let href: string | undefined = undefined;
    export let onClick: (() => void) | undefined = undefined;
    export let onItemClick: (() => void) | undefined = undefined;
    export let baseClassName =
        "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";
    export let className = "";

    const dispatch = createEventDispatcher();
    const combinedClasses = `${baseClassName} ${className}`.trim();

    function handleClick(event: MouseEvent) {
        if (tag === "button") {
            event.preventDefault();
        }
        if (onClick) onClick();
        if (onItemClick) onItemClick();
        dispatch("click");
    }
</script>

{#if tag === "a" && href}
    <a {href} class={combinedClasses} on:click={handleClick}>
        <slot></slot>
    </a>
{:else}
    <button class={combinedClasses} on:click={handleClick}>
        <slot></slot>
    </button>
{/if}
