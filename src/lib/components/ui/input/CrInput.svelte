<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { createEventDispatcher } from "svelte";

    type InputProps = {
        label: string;
        name: string;
        value: any;
        type?: string;
        placeholder?: string;
        error?: string | string[] | any | undefined;
        required?: boolean;
        disabled?: boolean;
    } & HTMLInputAttributes;

    let {
        label,
        name,
        value = $bindable(""),
        type = "text",
        placeholder = "",
        error = undefined,
        required = false,
        disabled = false,
        ...rest
    }: InputProps = $props();

    // Create a dispatcher for two-way binding
    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        value = type === "number" ? Number(target.value) : target.value;
        dispatchEvent(new CustomEvent("input"));
    }
</script>

<div class="space-y-2">
    <label
        for={name}
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
        {label}
        {#if required}
            <span class="text-yellow-500">*</span>
        {/if}
    </label>

    <input
        {name}
        {type}
        id={name}
        {placeholder}
        {disabled}
        {value}
        oninput={handleInput}
        {...rest}
        class="flex h-10 w-full rounded-md border px-3 py-2 text-sm
		       file:border-0 file:bg-transparent file:text-sm file:font-medium
		       focus-visible:outline-none focus-visible:ring-2
		       focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed
		       disabled:opacity-50 {error
            ? 'border-yellow-400 ring-yellow-400'
            : 'border-input'}"
    />

    {#if error}
        <p class="text-sm text-amber-500">
            {error}
        </p>
    {/if}
</div>
