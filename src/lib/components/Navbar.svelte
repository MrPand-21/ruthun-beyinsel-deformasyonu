<script lang="ts">
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import { fly, scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { Icons } from "./icons";

    // @ts-ignore - Workaround for TypeScript error with $app/forms
    import { enhance } from "$app/forms";
    import { Avatar, DropdownMenu } from "bits-ui";
    import GearSix from "phosphor-svelte/lib/GearSix";
    import UserCircle from "phosphor-svelte/lib/UserCircle";
    import Bell from "phosphor-svelte/lib/Bell";
    import Check from "phosphor-svelte/lib/Check";
    import CrButton from "./ui/button/CrButton.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { toast } from "svelte-sonner";

    const { user } = $props();

    let mobileMenuOpen = $state(false);
    let notifications = $state(false);

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<div
    class=" fixed top-6 left-1/2 transform -translate-x-1/2 z-40 rounded-lg px-1 py-1
backdrop-blur-md border border-gray-200 dark:border-indigo-500/30 shadow-sm"
>
    <nav class="items-center md:flex hidden gap-2 h-full">
        <a
            href="/activities"
            class="text-[0.9rem] h-full flex-1 py-2.5 px-2 rounded-md flex font-medium transition-all
        duration-300 dark:hover:bg-slate-50/20 hover:bg-slate-100/80"
        >
            <Icons.menu class="h-5 w-5 mr-2" />
            Activities
        </a>
        <a
            href="/"
            class=" items-center h-full flex-1 justify-center p-2.5 rounded-md
        transition-all duration-300 transform dark:hover:bg-slate-50/20 hover:bg-slate-100/80"
        >
            <Icons.home class="size-5" />
        </a>

        <a
            href="/profile#settings"
            class="items-center h-full flex-1 justify-center p-2.5 rounded-md
        transition-all duration-300 transform dark:hover:bg-slate-50/20 hover:bg-slate-100/80"
        >
            <GearSix class="size-5" />
        </a>

        {#if user}
            <a
                href="/profile"
                class="items-center h-full flex-1 justify-center p-2.5 rounded-md
transition-all duration-300 transform dark:hover:bg-slate-50/20 hover:bg-slate-100/80"
            >
                <Icons.user class="h-5 w-5" />
            </a>
        {:else}
            <CrButton
                variant="outline"
                size="icon"
                onclick={() => {
                    goto("/login");
                }}
                class=" !px-2 !py-2"
            >
                <Icons.logIn class="h-5 w-5" />
            </CrButton>
        {/if}

        <ThemeToggle />

        <form
            action="/sign-out"
            method="POST"
            class="items-center h-full flex-1 justify-center p-2.5 rounded-md
        transition-all duration-300 transform dark:hover:bg-slate-50/20 hover:bg-slate-100/80"
            use:enhance
            onsubmit={async () => {
                await invalidateAll();
            }}
        >
            <button
                type="submit"
                class="w-full flex items-center hover:cursor-pointer"
            >
                <Icons.logOut class="size-5 text-red-500" />
            </button>
        </form>

        <!-- Mobile Menu Buttons -->
        <div class="md:hidden flex w-full justify-end items-center">
            <a
                href="/"
                class="flex items-center justify-center p-2 rounded-lg border-2 border-indigo-500/30 hover:border-indigo-500
        shadow-sm hover:shadow-md transition-all duration-300 transform absolute left-0"
            >
                <Icons.home class="h-5 w-5" />
            </a>

            <ThemeToggle />
            {#if user}
                <button class="flex items-center" onclick={toggleMobileMenu}>
                    {#if user.image}
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            class="h-8 w-8 rounded-full border-2 border-gray-200"
                        />
                    {:else}
                        <div
                            class="h-9 w-9 rounded-lg bg-blue-500/80 flex items-center justify-center text-white"
                        >
                            {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                    {/if}
                </button>
            {:else}
                <button
                    class="rounded-lg p-2 border border-gray-500/30 hover:border-gray-500
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
            {/if}
        </div>
    </nav>
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
                <!-- Removed advises link -->

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

                        <form
                            action="/sign-out"
                            method="POST"
                            use:enhance
                            onsubmit={async () => {
                                toast.warning("Signing out...");
                                await invalidateAll();
                                mobileMenuOpen = false;
                            }}
                        >
                            <button
                                type="submit"
                                class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20
                                text-red-600 dark:text-red-400 transition-colors"
                                transition:scale={{ duration: 200, delay: 200 }}
                            >
                                <Icons.logOut class="h-6 w-6" />
                                <span class="font-medium">Sign Out</span>
                            </button>
                        </form>
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
</div>
