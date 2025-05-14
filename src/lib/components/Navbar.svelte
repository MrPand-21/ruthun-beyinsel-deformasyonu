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

    const { user } = $props();

    let mobileMenuOpen = $state(false);
    let notifications = $state(false);

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<nav class="w-full py-6 px-6">
    <div
        class="max-w-7xl mx-auto flex items-center justify-center relative w-full"
    >
        <a
            href="/"
            class="md:flex hidden items-center justify-center p-2 rounded-lg border-2 border-indigo-500/30 hover:border-indigo-500
        shadow-sm hover:shadow-md transition-all duration-300 transform absolute left-0"
        >
            <Icons.home class="h-5 w-5" />
        </a>

        <div class="md:flex hidden gap-4">
            <a
                href="/activities"
                class="  text-[0.9rem] font-medium border
        hover:border-b-purple-500 border-transparent
        transition-all duration-300 transform"
            >
                <span>Activities</span>
            </a>
            <a
                href="/advises"
                class="
        text-[0.9rem] font-medium border
        hover:border-b-purple-500 border-transparent
        transition-all duration-300 transform"
            >
                <span>Advises</span>
            </a>
        </div>
        <div class="md:flex hidden items-center absolute right-0 gap-1">
            {#if user}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        class="border-input hover:border-input-hover hover:cursor-pointer
                     inline-flex select-none items-center justify-center rounded-full border shadow-btn active:scale-[0.98]"
                    >
                        {#if user.image}
                            <Avatar.Root
                                class="relative flex size-8 shrink-0 overflow-hidden rounded-full border"
                            >
                                <Avatar.Image
                                    src={user.image}
                                    alt={user.name || "User"}
                                    class="aspect-square h-full w-full"
                                />
                                <Avatar.Fallback
                                    class="bg-muted text-xxs flex h-full w-full items-center justify-center rounded-full"
                                    >{(user.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}</Avatar.Fallback
                                >
                            </Avatar.Root>
                        {:else}
                            <Avatar.Root
                                class="relative flex size-8 shrink-0 overflow-hidden rounded-full border"
                            >
                                <Avatar.Fallback
                                    class="bg-blue-500 flex h-full w-full items-center justify-center rounded-full text-white"
                                    >{(user.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}</Avatar.Fallback
                                >
                            </Avatar.Root>
                        {/if}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            class="border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[229px] rounded-xl border px-1 py-1.5"
                            sideOffset={8}
                        >
                            <DropdownMenu.Item
                                onclick={() => goto("/profile")}
                                class="rounded-button hover:cursor-pointer data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
                            >
                                <div class="flex items-center">
                                    <UserCircle
                                        class="text-foreground-alt mr-2 size-5"
                                    />
                                    Profile
                                </div>
                                <div class="ml-auto flex items-center gap-px">
                                    <kbd
                                        class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-xs"
                                    >
                                        ⌘
                                    </kbd>
                                    <kbd
                                        class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[10px]"
                                    >
                                        P
                                    </kbd>
                                </div>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                onclick={() => goto("/profile#settings")}
                                class="rounded-button hover:cursor-pointer data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
                            >
                                <div class="flex items-center">
                                    <GearSix
                                        class="text-foreground-alt mr-2 size-5"
                                    />
                                    Settings
                                </div>
                                <div class="ml-auto flex items-center gap-px">
                                    <kbd
                                        class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-xs"
                                    >
                                        ⌘
                                    </kbd>
                                    <kbd
                                        class="rounded-button border-dark-10 bg-background-alt text-muted-foreground shadow-kbd inline-flex size-5 items-center justify-center border text-[10px]"
                                    >
                                        S
                                    </kbd>
                                </div>
                            </DropdownMenu.Item>
                            <DropdownMenu.CheckboxItem
                                bind:checked={notifications}
                                class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
                            >
                                {#snippet children({ checked })}
                                    <div class="flex items-center pr-4">
                                        <Bell
                                            class="text-foreground-alt mr-2 size-5"
                                        />
                                        Notifications
                                    </div>
                                    <div
                                        class="ml-auto flex items-center gap-px"
                                    >
                                        {#if checked}
                                            <Check class="size-4" />
                                        {/if}
                                    </div>
                                {/snippet}
                            </DropdownMenu.CheckboxItem>
                            <DropdownMenu.Separator
                                class="bg-border-card my-1 h-px"
                            />
                            <DropdownMenu.Item
                                onSelect={(e) => {
                                    e.preventDefault();
                                }}
                                class="rounded-button hover:cursor-pointer
                            data-highlighted:bg-muted ring-0!
                            ring-transparent! flex h-10 select-none
                            items-center py-3 pl-3 pr-1.5 text-sm
                            font-medium focus-visible:outline-none
                            text-red-600 dark:text-red-400"
                            >
                                <form
                                    action="/sign-out"
                                    method="POST"
                                    class=""
                                    use:enhance
                                    onsubmit={async () => {
                                        await invalidateAll();
                                    }}
                                >
                                    <button
                                        type="submit"
                                        class="w-full flex items-center hover:cursor-pointer"
                                    >
                                        <Icons.logOut class="mr-2 size-5" />
                                        Sign Out
                                    </button>
                                </form>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            {:else}
                <CrButton
                    onclick={() => {
                        goto("/login");
                    }}
                >
                    <Icons.logIn class="h-5 w-5" />
                </CrButton>
            {/if}

            <ThemeToggle />
        </div>

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

                        <form
                            action="/sign-out"
                            method="POST"
                            use:enhance
                            onsubmit={async () => {
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
</nav>
