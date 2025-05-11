<script lang="ts">
    import { enhance } from "$app/forms";

    const props = $props();
    const { data, form } = props;
</script>

<div
    class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16"
>
    <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Verify your email address
    </h1>

    <p class="mb-6 text-gray-600 dark:text-gray-300">
        We sent an 8-digit code to <span class="font-medium">{data?.email}</span
        >.
    </p>

    <form method="post" use:enhance action="?/verify" class="mb-6">
        <div class="mb-4">
            <label
                for="form-verify-code"
                class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
                Verification Code
            </label>
            <input
                id="form-verify-code"
                name="code"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your verification code"
                autocomplete="one-time-code"
            />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
            Verify
        </button>

        {#if form?.verify?.message}
            <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                {form.verify.message}
            </p>
        {/if}
    </form>

    <div class="flex flex-col space-y-4">
        <form method="post" use:enhance action="?/resend" class="inline-block">
            <button
                type="submit"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium focus:outline-none focus:underline"
            >
                Resend verification code
            </button>

            {#if form?.resend?.message}
                <p class="mt-1 text-sm text-green-600 dark:text-green-400">
                    {form.resend.message}
                </p>
            {/if}
        </form>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <a
                href="/settings"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
                Change your email address
            </a>
        </div>
    </div>
</div>
