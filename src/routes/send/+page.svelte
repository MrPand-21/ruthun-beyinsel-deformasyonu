<script lang="ts">
    import { superForm } from "sveltekit-superforms/client";
    import { zodClient } from "sveltekit-superforms/adapters";
    import Input from "$lib/components/Input.svelte";
    import AnimatedButton from "$lib/components/AnimatedButton.svelte";
    import { formSchema } from "./schema.js";
    import { Icons } from "$lib/components/icons";
    import Seo from "$lib/components/SEO.svelte";

    let { data } = $props();

    const { form, errors, enhance } = superForm(data.form, {
        validators: zodClient(formSchema),
        onResult: (result) => {
            switch (result.result.type) {
                case "success":
                    // toast.success("Your submission has been received!");
                    break;
                case "failure":
                    // toast.error(
                    //     "There was an issue with your submission. Please try again.",
                    // );
                    break;
            }
        },
        onError: (errors) => {
            // toast.error("An unexpected error occurred. Please contact us.");
        },
    });
</script>

<Seo
    title="Share Your Experience | RC Community Hub"
    description="Share your experiences, insights, and advice with the Robert College community"
    keywords="share experience, community contribution, RC community hub, student insights"
/>

<!-- <Toaster /> -->

<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <form method="POST" use:enhance class="flex flex-col lg:flex-row gap-8">
        <!-- Left Column - Heading and Submit Button -->
        <div
            class="lg:basis-2/5 lg:sticky lg:top-24 lg:self-start rounded-2xl
            bg-gradient-to-br from-indigo-800 to-indigo-950 text-white p-8 shadow-xl"
        >
            <div class="space-y-6">
                <div>
                    <h1 class="text-4xl font-bold">
                        <span class="block">Share with the Community</span>
                        <span class="block text-amber-400 mt-3 text-2xl">
                            Your experiences matter
                        </span>
                    </h1>
                    <p class="mt-6 text-lg text-indigo-100">
                        Help future students by sharing your insights, tips, and
                        advice. Your contribution can make a difference in
                        someone's academic journey.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="flex items-start">
                        <Icons.star class="h-6 w-6 text-amber-400 mt-1 mr-3" />
                        <p>
                            Your experiences will be reviewed and added to our
                            community resources
                        </p>
                    </div>
                    <div class="flex items-start">
                        <Icons.chat class="h-6 w-6 text-amber-400 mt-1 mr-3" />
                        <p>
                            You can choose to share anonymously or with your
                            name
                        </p>
                    </div>
                    <div class="flex items-start">
                        <Icons.userPlus
                            class="h-6 w-6 text-amber-400 mt-1 mr-3"
                        />
                        <p>
                            Join a community of students helping each other
                            succeed
                        </p>
                    </div>
                </div>

                <div class="pt-6">
                    <AnimatedButton type="submit" className="w-full md:w-auto">
                        Share Your Experience
                        <Icons.send class="ml-2 h-4 w-4" />
                    </AnimatedButton>
                </div>
            </div>
        </div>

        <!-- Right Column - Form Fields -->
        <div class="flex-1 space-y-8">
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 space-y-6 border border-gray-200/50 dark:border-gray-700/50"
            >
                <!-- Personal Information -->
                <div class="space-y-4">
                    <h2 class="text-xl font-semibold flex items-center">
                        <Icons.userPlus
                            class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
                        />
                        Personal Information
                    </h2>
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                            label="First Name"
                            name="firstName"
                            bind:value={$form.firstName}
                            ariaInvalid={$errors.firstName ? "true" : undefined}
                            error={$errors.firstName}
                            required
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            bind:value={$form.lastName}
                            error={$errors.lastName}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            bind:value={$form.email}
                            error={$errors.email}
                            required
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            name="phone"
                            bind:value={$form.phone}
                            error={$errors.phone}
                            required
                        />
                    </div>
                </div>

                <!-- Academic Information -->
                <div
                    class="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                    <h2 class="text-xl font-semibold flex items-center">
                        <Icons.book
                            class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
                        />
                        Academic Information
                    </h2>
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                            label="School"
                            name="school"
                            bind:value={$form.school}
                            error={$errors.school}
                            required
                        />
                        <Input
                            label="Grade/Year"
                            type="number"
                            name="grade"
                            bind:value={$form.grade}
                            error={$errors.grade}
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="subjects"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Topics of Interest
                            <span class="text-red-500">*</span>
                        </label>
                        <select
                            id="subjects"
                            multiple
                            name="subjects"
                            bind:value={$form.subjects}
                            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700
                            bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500
                            focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                        >
                            <option value="summer">Summer Programs</option>
                            <option value="academics">Academic Courses</option>
                            <option value="clubs">Club Activities</option>
                            <option value="college">College Applications</option
                            >
                        </select>
                        {#if $errors.subjects}
                            <p class="text-red-500 text-sm">
                                {Array.isArray($errors.subjects)
                                    ? $errors.subjects[0]
                                    : $errors.subjects}
                            </p>
                        {/if}
                    </div>
                </div>

                <!-- Experience Details -->
                <div
                    class="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                    <h2 class="text-xl font-semibold flex items-center">
                        <Icons.chat
                            class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
                        />
                        Your Experience
                    </h2>
                    <div class="space-y-2">
                        <label
                            for="message"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Share your story, tips, or advice
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            bind:value={$form.message}
                            rows="6"
                            class="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
                            rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                            dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                        ></textarea>
                        {#if $errors.message}
                            <p class="text-red-500 text-sm">
                                {$errors.message}
                            </p>
                        {/if}
                    </div>
                </div>
            </div>

            <p class="text-sm text-center text-gray-500 dark:text-gray-400">
                By submitting this form, you agree to share your experience with
                the RC Community Hub. Your information will be handled according
                to our privacy policy.
            </p>
        </div>
    </form>
</div>
