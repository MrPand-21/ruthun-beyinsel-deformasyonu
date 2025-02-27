<script lang="ts">
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import { fly, scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { Icons } from "./icons";

    let mobileMenuOpen = $state(false);

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<nav class="w-full py-6 px-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a
            href="/"
            class="flex items-center justify-center p-3 rounded-xl border-2 border-indigo-500/30 hover:border-indigo-500
            text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
            shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
            <Icons.home class="h-5 w-5" />
        </a>

        <div class="hidden md:flex items-center space-x-6">
            <a
                href="/activities"
                class="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-purple-500/30
                hover:border-purple-500 text-purple-600 dark:text-purple-400
                hover:text-purple-700 dark:hover:text-purple-300 shadow-sm hover:shadow-md
                transition-all duration-300 transform hover:-translate-y-1"
            >
                <Icons.star class="h-5 w-5" />
                <span>Activities</span>
            </a>
            <a
                href="/advises"
                class="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-sky-500/30
                hover:border-sky-500 text-sky-600 dark:text-sky-400
                hover:text-sky-700 dark:hover:text-sky-300 shadow-sm hover:shadow-md
                transition-all duration-300 transform hover:-translate-y-1"
            >
                <Icons.chat class="h-5 w-5" />
                <span>Advises</span>
            </a>
            <ThemeToggle />
        </div>

        <div class="md:hidden flex items-center space-x-4">
            <a
                href="/activities"
                class="flex items-center justify-center p-3 rounded-xl border-2 border-purple-500/30
                hover:border-purple-500 text-purple-600 dark:text-purple-400
                shadow-sm hover:shadow-md transition-all duration-300"
            >
                <Icons.star class="h-5 w-5" />
            </a>
            <a
                href="/advises"
                class="flex items-center justify-center p-3 rounded-xl border-2 border-sky-500/30
                hover:border-sky-500 text-sky-600 dark:text-sky-400
                shadow-sm hover:shadow-md transition-all duration-300"
            >
                <Icons.chat class="h-5 w-5" />
            </a>
            <ThemeToggle />
            <button
                class="p-3 rounded-xl border-2 border-gray-500/30 hover:border-gray-500
                text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
                shadow-sm hover:shadow-md transition-all duration-300"
                onclick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {#if mobileMenuOpen}
                    <Icons.x class="h-5 w-5" />
                {:else}
                    <Icons.menu class="h-5 w-5" />
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
        <div
            class="md:hidden absolute top-20 right-4 left-4 z-50 py-4 px-6 rounded-2xl bg-white/90 dark:bg-gray-800/90
            backdrop-blur-lg shadow-xl border-2 border-gray-200 dark:border-gray-700"
            transition:fly={{ y: -20, duration: 300, easing: quintOut }}
        >
            <div class="flex flex-col space-y-4">
                <a
                    href="/activities"
                    class="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20
                    text-purple-600 dark:text-purple-400 transition-colors"
                    onclick={() => (mobileMenuOpen = false)}
                    transition:scale={{ duration: 200, delay: 100 }}
                >
                    <Icons.star class="h-6 w-6" />
                    <span class="font-medium">Activities</span>
                </a>
                <a
                    href="/advises"
                    class="flex items-center space-x-3 p-3 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/20
                    text-sky-600 dark:text-sky-400 transition-colors"
                    onclick={() => (mobileMenuOpen = false)}
                    transition:scale={{ duration: 200, delay: 150 }}
                >
                    <Icons.chat class="h-6 w-6" />
                    <span class="font-medium">Advises</span>
                </a>
            </div>
        </div>
    {/if}
</nav>
