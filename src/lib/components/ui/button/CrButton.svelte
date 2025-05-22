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
        variant?:
            | "default"
            | "primary"
            | "secondary"
            | "outline"
            | "danger"
            | "ghost"
            | "link";
        children: Snippet;
    } = $props();

    const variantStyles = {
        default:
            "bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-300 border-2",
        primary:
            "bg-amber-500 text-white hover:bg-amber-600 border-amber-600 border-2",
        secondary:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 border-2",
        outline:
            "bg-transparent text-amber-500 hover:bg-amber-50 border-amber-300 border-2",
        danger: "bg-red-500 text-white hover:bg-red-600 border-red-600 border-2",
        ghost: "bg-transparent text-amber-500 hover:bg-amber-50 border-transparent",
        link: "bg-transparent text-amber-500 hover:underline border-transparent underline-offset-4 h-auto p-0",
    };
</script>

<Button.Root
    class={"rounded-md hover:shadow-md inline-flex w-full h-12 items-center justify-center px-4 py-2 text-md hover:cursor-pointer transition-colors duration-200 font-semibold active:scale-[0.98] active:transition-all " +
        variantStyles[variant] +
        " " +
        className}
    aria-label={labelText}
    {...restProps}
>
    {@render children()}
</Button.Root>
