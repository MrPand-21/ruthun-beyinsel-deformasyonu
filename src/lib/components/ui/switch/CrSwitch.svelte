<script lang="ts">
    import { Switch, Label, useId, type WithoutChildrenOrChild } from "bits-ui";

    let {
        id = useId(),
        checked = $bindable(false),
        ref = $bindable(null),
        labelText,
        ...restProps
    }: WithoutChildrenOrChild<Switch.RootProps> & {
        labelText: string;
    } = $props();
</script>

<Switch.Root
    bind:checked
    bind:ref
    {id}
    {...restProps}
    class="focus-visible:ring-red-500 focus-visible:ring-offset-red-400 bg-sky-700/30 focus-visible:outline-hidden rounded-full
      data-[state=unchecked]:shadow-mini-inset overflow-hidden peer inline-flex p-1 shrink-0 cursor-pointer items-center data-[state=checked]:bg-sky-700/50
      focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors delay-300 "
>
    <Switch.Thumb
        class=" bg-sky-600 data-[state=unchecked]:shadow-mini dark:border-slate-600/30 pointer-events-none
         block size-4 shrink-0 rounded-full data-[state=unchecked]:translate-x-8 data-[state=unchecked]:translate-y-2
        dark:border dark:data-[state=unchecked]:border  transition-all duration-300 "
    />
</Switch.Root>
<Label.Root for={id} class="text-sm font-medium">{labelText}</Label.Root>
