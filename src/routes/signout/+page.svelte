<script>
    import { SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
</script>

<div class="container mx-auto max-w-md py-12">
    <h1 class="text-2xl font-bold mb-8 text-center">Sign Out</h1>

    <div class="bg-white p-8 rounded-lg shadow-md">
        {#if $page.data.session}
            <div class="flex flex-col items-center mb-6">
                {#if $page.data.session.user?.image}
                    <img
                        src={$page.data.session.user.image}
                        alt="User profile"
                        class="w-16 h-16 rounded-full mb-4"
                    />
                {/if}
                <p class="text-center">
                    <span class="block text-sm text-gray-500">Signed in as</span
                    >
                    <span class="font-semibold"
                        >{$page.data.session.user?.name ||
                            $page.data.session.user?.email ||
                            "User"}</span
                    >
                </p>
            </div>

            <SignOut>
                <div
                    slot="submitButton"
                    class="bg-red-600 text-white py-2 px-4 rounded-md w-full text-center hover:bg-red-700"
                >
                    Sign out
                </div>
            </SignOut>
        {:else}
            <p class="text-center py-4">You are not signed in.</p>
            <a
                href="/signin"
                class="block bg-blue-600 text-white py-2 px-4 rounded-md w-full text-center hover:bg-blue-700"
            >
                Go to sign in
            </a>
        {/if}
    </div>
</div>
