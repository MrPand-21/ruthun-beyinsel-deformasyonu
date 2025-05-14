<script lang="ts">
    import { type Snippet } from "svelte";
    import { Button, useId, type WithoutChildrenOrChild } from "bits-ui";
    let {
        id = useId(),
        ref = $bindable(null),
        labelText = "",
        class: className = "",
        variant = "default",
        children,
        ...restProps
    }: WithoutChildrenOrChild<Button.RootProps> & {
        labelText?: string;
        variant?: string;
        children: Snippet;
    } = $props();
</script>

<Button.Root
    class={`rounded-md hover:shadow-md inline-flex w-full border-amber-300 border-2
      h-12 items-center justify-center px-4 py-2 text-md hover:cursor-pointer hover:bg-amber-300 transition-colors duration-200
      font-semibold active:scale-[0.98] active:transition-all` + className}
    aria-label={labelText}
    {...restProps}
>
    {@render children()}
</Button.Root>
