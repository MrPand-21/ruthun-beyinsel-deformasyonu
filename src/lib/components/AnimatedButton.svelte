<script lang="ts">
    export let href: string;
    export let className = "";
</script>

<span class="relative h-auto group">
    <a
        {href}
        class="animated-button px-6 py-3 group-hover:pb-2.5 group-hover:transition-all group-hover:duration-500
         group-hover:pt-3.5 overflow-visible {className}"
    >
        <span
            class="flex relative group-hover:text-[var(--text-inverted)] items-center justify-center gap-2 z-[1]"
        >
            <slot />
        </span>
        <span
            class="absolute w-full bottom-0 left-0 h-full z-[-1]
          bg-amber-400 group-hover:w-0 transition-all duration-500"
        ></span>
    </a>
</span>

<style>
    .animated-button {
        position: relative;
        display: inline-flex;
        font-weight: 600;
        color: var(--text-primary);
        background: transparent;
        border: 2px solid currentColor;
        border-bottom: 6.2px solid currentColor;
        border-right: 3.5px solid currentColor;
        border-radius: 0.5rem;
        border-top-right-radius: 1.2rem;
        transform-style: preserve-3d;
        transition:
            transform 0.2s ease,
            background-color 0.2s ease;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
    }

    .animated-button::before,
    .animated-button::after {
        content: "";
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: #8c3030;
        transform: scaleX(0);
        transition: transform 0.3s ease;
        z-index: -1;
    }

    .animated-button::after {
        right: 0;
        border-top: 4px solid #612525;
        border-left: 4.5px solid #612525;
        border-radius: 0.25rem;
        border-top-right-radius: 1.2rem;
        transform-origin: right;
    }

    .animated-button::before  {
        left: 0;
        transform-origin: left;
    }

    .animated-button:hover {
        transform: translateY(4px);
        border-color: transparent;
    }

    .animated-button:hover::before,
    .animated-button:hover::after {
        transform: scaleX(1);
    }

    .animated-button:active {
        transform: translateY(12px);
    }
</style>
