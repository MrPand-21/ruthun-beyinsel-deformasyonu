<script lang="ts">
    import { Icons } from "$lib/components/icons";
    import Seo from "$lib/components/SEO.svelte";
    import { goto } from "$app/navigation";
    import { slide, fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import CrButton from "$lib/components/ui/button/CrButton.svelte";
    import ComponentCard from "$lib/components/ui/ComponentCard.svelte";

    const { data } = $props();
    const { user, activities } = data;

    let activeTab = $state("activities");
    let showActivityDetails = $state<string | null>(null);
    let isEditingProfile = $state(false);
    let successMessage = $state("");
    let errorMessage = $state("");

    async function handleProfileUpdate() {
        try {
            // Future implementation for profile updates
            isEditingProfile = false;
            successMessage = "Profile updated successfully!";
            setTimeout(() => (successMessage = ""), 3000);
        } catch (error) {
            errorMessage = "Failed to update profile";
            setTimeout(() => (errorMessage = ""), 3000);
        }
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function getCategoryIcon(category: string) {
        switch (category) {
            case "internship":
                return Icons.briefcase;
            case "course":
                return Icons.book;
            case "travel":
                return Icons.plane;
            case "volunteering":
                return Icons.heart;
            default:
                return Icons.star;
        }
    }

    function getCategoryColor(category: string): string {
        switch (category) {
            case "internship":
                return "bg-blue-100 text-blue-800";
            case "course":
                return "bg-purple-100 text-purple-800";
            case "travel":
                return "bg-green-100 text-green-800";
            case "volunteering":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    function getCategoryLabel(category: string): string {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
</script>

<Seo
    title="My Profile"
    description="Manage your profile and activities on RC Community Hub"
    keywords="profile, activities, summer activities, robert college"
/>

<div class="container mx-auto px-4 py-8 max-w-7xl">
    {#if successMessage}
        <div
            in:fade={{ duration: 300 }}
            out:fade={{ duration: 200 }}
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
        >
            <span class="block sm:inline">{successMessage}</span>
        </div>
    {/if}

    {#if errorMessage}
        <div
            in:fade={{ duration: 300 }}
            out:fade={{ duration: 200 }}
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
        >
            <span class="block sm:inline">{errorMessage}</span>
        </div>
    {/if}

    <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-1/3">
            <ComponentCard>
                <div class="p-4 flex flex-col items-center">
                    <div class="relative">
                        {#if false}
                            <img
                                src={""}
                                alt={user.username}
                                class="h-24 w-24 rounded-full object-cover border-2 border-purple-200 shadow-md"
                            />
                        {:else}
                            <div
                                class="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-md"
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        {/if}
                        <span
                            class="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-white"
                        ></span>
                    </div>

                    <h1 class="text-2xl font-bold mt-4">{user.username}</h1>
                    <p class="text-gray-600">{user.email}</p>

                    <div class="my-2 flex items-center">
                        <span
                            class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center"
                        >
                            {#if user.emailVerified}
                                <div>
                                    <Icons.check class="w-3 h-3 mr-1" /> Verified
                                </div>
                            {:else}
                                <div class="flex items-center">
                                    <Icons.triangleAlert class="w-3 h-3 mr-1" />
                                    Unverified
                                </div>
                            {/if}
                        </span>
                        <span
                            class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                            {activities.length} Activities
                        </span>
                    </div>

                    {#if !isEditingProfile}
                        <CrButton
                            onclick={() => (isEditingProfile = true)}
                            class="mt-4 w-full"
                        >
                            <Icons.edit class="w-4 h-4 mr-2" />
                            Edit Profile
                        </CrButton>
                    {:else}
                        <div class="mt-4 w-full space-y-3">
                            <div class="flex flex-col">
                                <label
                                    for="username"
                                    class="text-sm text-gray-600 mb-1"
                                    >Username</label
                                >
                                <input
                                    id="username"
                                    type="text"
                                    class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={user.username}
                                />
                            </div>

                            <div class="flex space-x-2">
                                <CrButton
                                    onclick={() => (isEditingProfile = false)}
                                    class="flex-1"
                                >
                                    Cancel
                                </CrButton>
                                <CrButton
                                    onclick={handleProfileUpdate}
                                    class="flex-1"
                                >
                                    Save
                                </CrButton>
                            </div>
                        </div>
                    {/if}

                    <div class="border-t border-gray-200 w-full mt-6 pt-4">
                        <h2 class="text-lg font-semibold mb-3">
                            Account Statistics
                        </h2>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-gray-50 p-3 rounded-lg text-center">
                                <div class="text-xl font-bold text-purple-600">
                                    {activities.length}
                                </div>
                                <div class="text-xs text-gray-500">
                                    Activities
                                </div>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-lg text-center">
                                <div class="text-xl font-bold text-blue-600">
                                    Today
                                </div>
                                <div class="text-xs text-gray-500">Joined</div>
                            </div>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>

        <!-- Main Content Section -->
        <div class="w-full lg:w-2/3">
            <!-- Tabs -->
            <div class="border-b border-gray-200 flex mb-6">
                <button
                    class={`py-3 px-4 font-medium text-sm ${activeTab === "activities" ? "border-b-2 border-purple-500 text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                    onclick={() => (activeTab = "activities")}
                >
                    <Icons.star class="inline-block w-4 h-4 mr-1" />
                    My Activities
                </button>
                <button
                    class={`py-3 px-4 font-medium text-sm ${activeTab === "settings" ? "border-b-2 border-purple-500 text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                    onclick={() => (activeTab = "settings")}
                >
                    <Icons.settings class="inline-block w-4 h-4 mr-1" />
                    Settings
                </button>
            </div>

            {#if activeTab === "activities"}
                {#if activities.length === 0}
                    <ComponentCard>
                        <div class="p-8 text-center">
                            <Icons.calendar
                                class="w-16 h-16 text-gray-300 mx-auto mb-4"
                            />
                            <h3 class="text-xl font-semibold text-gray-700">
                                No Activities Yet
                            </h3>
                            <p class="text-gray-500 mb-6">
                                You haven't created any activities yet. Start by
                                adding your first summer activity!
                            </p>
                            <CrButton onclick={() => goto("/activities")}>
                                <Icons.plus class="w-4 h-4 mr-2" />
                                Add Activity
                            </CrButton>
                        </div>
                    </ComponentCard>
                {:else}
                    <div class="grid grid-cols-1 gap-6">
                        {#each activities as activity}
                            <ComponentCard>
                                <div class="px-6 py-5">
                                    <div
                                        class="flex justify-between items-start mb-3"
                                    >
                                        <div>
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <h3
                                                    class="text-xl font-semibold"
                                                >
                                                    {activity.title}
                                                </h3>
                                                <span
                                                    class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}
                                                >
                                                    <svelte:component
                                                        this={getCategoryIcon(
                                                            activity.category,
                                                        )}
                                                        class="w-3 h-3 mr-1"
                                                    />
                                                    {getCategoryLabel(
                                                        activity.category,
                                                    )}
                                                </span>
                                            </div>
                                            <div
                                                class="text-sm text-gray-500 mt-1"
                                            >
                                                <span title={activity.createdAt}
                                                    >Added on {formatDate(
                                                        activity.createdAt,
                                                    )}</span
                                                >
                                                {#if activity.updatedAt !== activity.createdAt}
                                                    <span class="mx-1">•</span>
                                                    <span
                                                        title={activity.updatedAt}
                                                        >Updated on {formatDate(
                                                            activity.updatedAt,
                                                        )}</span
                                                    >
                                                {/if}
                                            </div>
                                        </div>

                                        <div class="flex space-x-2">
                                            <button
                                                onclick={() =>
                                                    goto(
                                                        `/activities/${activity.id}`,
                                                    )}
                                                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-150"
                                                aria-label="View activity details"
                                            >
                                                <Icons.eye class="w-5 h-5" />
                                            </button>
                                            <button
                                                onclick={() =>
                                                    goto(
                                                        `/activities/${activity.id}?edit=true`,
                                                    )}
                                                class="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-150"
                                                aria-label="Edit activity"
                                            >
                                                <Icons.edit class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        class="w-full text-left"
                                        onclick={() =>
                                            (showActivityDetails =
                                                showActivityDetails ===
                                                activity.id
                                                    ? null
                                                    : activity.id)}
                                    >
                                        <p
                                            class="text-gray-700 line-clamp-2 mb-2"
                                        >
                                            {activity.description}
                                        </p>

                                        <span
                                            class="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                                        >
                                            {showActivityDetails === activity.id
                                                ? "Show less"
                                                : "Show more"}
                                            <Icons.arrowDown
                                                class={`w-4 h-4 ml-1 transform transition-transform ${showActivityDetails === activity.id ? "rotate-180" : ""}`}
                                            />
                                        </span>
                                    </button>

                                    {#if showActivityDetails === activity.id}
                                        <div
                                            transition:slide={{
                                                duration: 300,
                                                easing: quintOut,
                                            }}
                                            class="mt-4 space-y-3 border-t border-gray-100 pt-4"
                                        >
                                            {#if activity.location}
                                                <div class="flex items-start">
                                                    <Icons.mapPin
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Location
                                                        </div>
                                                        <div
                                                            class="text-gray-600"
                                                        >
                                                            {activity.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            {/if}

                                            <div class="flex items-start">
                                                <Icons.clock
                                                    class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                />
                                                <div>
                                                    <div
                                                        class="text-sm font-medium text-gray-700"
                                                    >
                                                        Duration
                                                    </div>
                                                    <div class="text-gray-600">
                                                        {activity.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            {#if activity.major}
                                                <div class="flex items-start">
                                                    <Icons.graduationCap
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Major
                                                        </div>
                                                        <div
                                                            class="text-gray-600"
                                                        >
                                                            {activity.major
                                                                .title}
                                                        </div>
                                                    </div>
                                                </div>
                                            {/if}

                                            {#if activity.cost}
                                                <div class="flex items-start">
                                                    <Icons.dollarCircle
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Cost
                                                        </div>
                                                        <div
                                                            class="text-gray-600"
                                                        >
                                                            ${activity.cost}
                                                        </div>
                                                    </div>
                                                </div>
                                            {/if}

                                            {#if activity.recommended}
                                                <div class="flex items-start">
                                                    <Icons.star
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Recommended
                                                        </div>
                                                        <div
                                                            class="text-gray-600"
                                                        >
                                                            {activity.recommended}/5
                                                        </div>
                                                    </div>
                                                </div>
                                            {/if}

                                            {#if activity.requirements && activity.requirements.length > 0}
                                                <div class="flex items-start">
                                                    <Icons.check
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Requirements
                                                        </div>
                                                        <ul
                                                            class="text-gray-600 list-disc list-inside"
                                                        >
                                                            {#each activity.requirements as req}
                                                                <li>
                                                                    {req.title}
                                                                </li>
                                                            {/each}
                                                        </ul>
                                                    </div>
                                                </div>
                                            {/if}

                                            {#if activity.goodForWho}
                                                <div class="flex items-start">
                                                    <Icons.users
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Good For
                                                        </div>
                                                        <div
                                                            class="text-gray-600"
                                                        >
                                                            {activity.goodForWho}
                                                        </div>
                                                    </div>
                                                </div>
                                            {/if}

                                            {#if activity.link}
                                                <div class="flex items-start">
                                                    <Icons.link
                                                        class="w-5 h-5 text-gray-400 mr-2 mt-0.5"
                                                    />
                                                    <div>
                                                        <div
                                                            class="text-sm font-medium text-gray-700"
                                                        >
                                                            Website
                                                        </div>
                                                        <a
                                                            href={activity.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            class="text-blue-600 hover:underline"
                                                            >{activity.link}</a
                                                        >
                                                    </div>
                                                </div>
                                            {/if}

                                            <div class="flex justify-end pt-2">
                                                <CrButton
                                                    variant="outline"
                                                    onclick={() =>
                                                        goto(
                                                            `/activities/${activity.id}`,
                                                        )}
                                                >
                                                    <Icons.externalLink
                                                        class="w-4 h-4 mr-2"
                                                    />
                                                    View Full Details
                                                </CrButton>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </ComponentCard>
                        {/each}
                    </div>
                {/if}
            {:else if activeTab === "settings"}
                <ComponentCard>
                    <div class="p-6">
                        <h2 class="text-xl font-bold mb-4">Account Settings</h2>

                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-medium mb-2">
                                    Email Preferences
                                </h3>
                                <div class="space-y-3">
                                    <div class="flex items-center">
                                        <input
                                            id="notification-email"
                                            type="checkbox"
                                            class="h-4 w-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500"
                                            checked
                                        />
                                        <label
                                            for="notification-email"
                                            class="ml-2 block text-sm text-gray-700"
                                            >Email me about new activities</label
                                        >
                                    </div>
                                    <div class="flex items-center">
                                        <input
                                            id="newsletter-email"
                                            type="checkbox"
                                            class="h-4 w-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500"
                                        />
                                        <label
                                            for="newsletter-email"
                                            class="ml-2 block text-sm text-gray-700"
                                            >Subscribe to newsletter</label
                                        >
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 class="text-lg font-medium mb-2">
                                    Password
                                </h3>
                                <CrButton variant="outline">
                                    <Icons.lock class="w-4 h-4 mr-2" />
                                    Change Password
                                </CrButton>
                            </div>

                            <div class="border-t border-gray-200 pt-6">
                                <h3
                                    class="text-lg font-medium text-red-600 mb-2"
                                >
                                    Danger Zone
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">
                                    Once you delete your account, there is no
                                    going back. Please be certain.
                                </p>
                                <CrButton variant="destructive">
                                    <Icons.trash class="w-4 h-4 mr-2" />
                                    Delete Account
                                </CrButton>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            {/if}
        </div>
    </div>
</div>
