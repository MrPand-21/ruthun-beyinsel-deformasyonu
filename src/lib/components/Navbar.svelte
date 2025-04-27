<script lang="ts">
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import { fly, scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { Icons } from "./icons";
    import { page } from "$app/stores";
    import { signOut } from "@auth/sveltekit/client";
    import { goto } from "$app/navigation";

    let mobileMenuOpen = $state(false);

    let session = $state($page.data.session);
    let user = $state(session?.user);

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    async function handleSignOut() {
        mobileMenuOpen = false;
        await signOut({ callbackUrl: "/" });
    }
</script>

<nav class="w-full py-6 px-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a
            href="/"
            class="flex items-center justify-center p-3 rounded-lg border-2 border-indigo-500/30 hover:border-indigo-500
            shadow-sm hover:shadow-md transition-all duration-300 transform"
        >
            <Icons.home class="h-5 w-5" />
        </a>

        <div class="hidden md:flex items-center space-x-6">
            <a
                href="/activities"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-purple-500/30
                hover:border-purple-500
                transition-all duration-300 transform"
            >
                <Icons.star class="h-5 w-5" />
                <span>Activities</span>
            </a>
            <a
                href="/advises"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-sky-500/30
                hover:border-sky-500
                transition-all duration-300 transform"
            >
                <Icons.chat class="h-5 w-5" />
                <span>Advises</span>
            </a>

            {#if user}
                <div class="flex items-center space-x-4">
                    {#if user.image}
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            class="h-8 w-8 rounded-full border-2 border-gray-200"
                        />
                    {:else}
                        <div
                            class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                        >
                            {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                    {/if}
                    <button
                        onclick={handleSignOut}
                        class="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-red-500/30
                        hover:border-red-500
                        transition-all duration-300 transform"
                    >
                        <Icons.logOut class="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            {:else}
                <div class="flex items-center space-x-3">
                    {#if $page.data.session}
                        <img
                            src={$page.data.session.user?.image}
                            alt={$page.data.session.user?.name || "User"}
                            class="h-8 w-8 rounded-full border-2 border-gray-200"
                        />
                        <span
                            class="text-sm font-medium text-gray-800 dark:text-gray-200"
                            >{$page.data.session.user?.name || "User"}</span
                        >
                    {:else}
                        <a
                            href="/login"
                            class="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-blue-500/30
                        hover:border-blue-500
                        transition-all duration-300 transform"
                        >
                            <Icons.logIn class="h-5 w-5" />
                            <span>Sign In</span>
                        </a>
                        <a
                            href="/register"
                            class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white
                        hover:bg-blue-700
                        transition-all duration-300 transform"
                        >
                            <Icons.userPlus class="h-5 w-5" />
                            <span>Register</span>
                        </a>
                    {/if}
                </div>
            {/if}

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

            {#if user}
                <div class="flex items-center">
                    {#if user.image}
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            class="h-8 w-8 rounded-full border-2 border-gray-200"
                        />
                    {:else}
                        <div
                            class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                        >
                            {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                    {/if}
                </div>
            {/if}

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

                {#if user}
                    <div
                        class="pt-2 border-t border-gray-200 dark:border-gray-700"
                    >
                        <div class="flex items-center space-x-3 p-3">
                            {#if user.image}
                                <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    class="h-8 w-8 rounded-full border-2 border-gray-200"
                                />
                            {:else}
                                <div
                                    class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                                >
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </div>
                            {/if}
                            <span class="font-medium"
                                >{user.name || user.email}</span
                            >
                        </div>

                        <button
                            class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20
                            text-red-600 dark:text-red-400 transition-colors"
                            onclick={() => handleSignOut()}
                            transition:scale={{ duration: 200, delay: 200 }}
                        >
                            <Icons.logOut class="h-6 w-6" />
                            <span class="font-medium">Sign Out</span>
                        </button>
                    </div>
                {:else}
                    <div
                        class="pt-2 border-t border-gray-200 dark:border-gray-700"
                    >
                        <a
                            href="/login"
                            class="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20
                            text-blue-600 dark:text-blue-400 transition-colors"
                            onclick={() => (mobileMenuOpen = false)}
                            transition:scale={{ duration: 200, delay: 200 }}
                        >
                            <Icons.logIn class="h-6 w-6" />
                            <span class="font-medium">Sign In</span>
                        </a>
                        <a
                            href="/register"
                            class="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/20
                            text-green-600 dark:text-green-400 transition-colors"
                            onclick={() => (mobileMenuOpen = false)}
                            transition:scale={{ duration: 200, delay: 250 }}
                        >
                            <Icons.userPlus class="h-6 w-6" />
                            <span class="font-medium">Register</span>
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</nav>
