<script lang="ts">
    import { fly, fade, scale } from "svelte/transition";
    import { onMount } from "svelte";
    import { Icons } from "$lib/components/icons";
    import Seo from "$lib/components/SEO.svelte";
    import CrButton from "$lib/components/ui/button/CrButton.svelte";
    import { goto } from "$app/navigation";

    let { data } = $props();
    let activity = data.activity;

    let sections = $state<NodeListOf<Element> | null>(null);
    let activeSection = $state<null | string>(null);
    let isLoaded = $state(false);

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
            case "research":
                return Icons.search;
            case "workshop":
                return Icons.sliders;
            case "hackathon":
                return Icons.code;
            default:
                return Icons.star;
        }
    }

    function getCategoryColor(category: string) {
        switch (category) {
            case "internship":
                return "from-blue-400 to-blue-600";
            case "course":
                return "from-purple-400 to-purple-600";
            case "travel":
                return "from-green-400 to-green-600";
            case "volunteering":
                return "from-amber-400 to-amber-600";
            case "research":
                return "from-indigo-400 to-indigo-600";
            case "workshop":
                return "from-red-400 to-red-600";
            case "hackathon":
                return "from-cyan-400 to-cyan-600";
            default:
                return "from-secondary to-secondary-soft";
        }
    }

    function formatDate(date: Date): string {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    onMount(() => {
        sections = document.querySelectorAll(".detail-section");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeSection = entry.target.id;
                    }
                });
            },
            { threshold: 0.6 },
        );

        sections.forEach((section) => observer.observe(section));

        // Animation delay
        setTimeout(() => {
            isLoaded = true;
        }, 300);
    });
</script>

<Seo
    title={activity?.title || "Activity Detail"}
    description={activity?.description ||
        "Explore the details of this activity"}
/>

<main class="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8">
    {#if activity && isLoaded}
        <div class="grid gap-10 md:grid-cols-3">
            <div
                class="md:col-span-2 flex flex-col space-y-8"
                in:fly={{ y: 20, duration: 400, delay: 200 }}
            >
                <div
                    class="rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
                >
                    <div
                        class="relative h-48 bg-gradient-to-br {getCategoryColor(
                            activity.category,
                        )}"
                    >
                        <div
                            class="absolute inset-0 opacity-30 pattern-grid"
                        ></div>

                        <svelte:component
                            this={getCategoryIcon(activity.category)}
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 opacity-25"
                        />

                        <div
                            class="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-medium shadow-sm flex items-center gap-1.5"
                        >
                            <svelte:component
                                this={getCategoryIcon(activity.category)}
                                class="h-4 w-4 text-primary"
                            />
                            <span class="capitalize">{activity.category}</span>
                        </div>
                    </div>

                    <div class="p-6">
                        <h1 class="text-4xl font-bold mb-4 text-fr">
                            {activity.title}
                        </h1>
                    </div>
                </div>

                <!-- Details content sections -->
                <div
                    id="overview"
                    class="detail-section p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-500"
                    class:shadow-lg={activeSection === "overview"}
                    in:fade={{ duration: 300, delay: 400 }}
                >
                    <h2 class="text-2xl font-bold mb-4 flex items-center">
                        <Icons.info class="h-6 w-6 mr-2 text-primary" />
                        Overview
                    </h2>
                    <div class="grid gap-6 md:grid-cols-2">
                        <div
                            class="flex items-center p-4 rounded-xl bg-primary-50/30 dark:bg-primary-50/5"
                        >
                            <Icons.calendar
                                class="h-5 w-5 mr-3 text-secondary"
                            />
                            <div>
                                <p class="text-sm text-fr/70">Year</p>
                                <p class="font-medium">{activity.year}</p>
                            </div>
                        </div>

                        <div
                            class="flex items-center p-4 rounded-xl bg-primary-50/30 dark:bg-primary-50/5"
                        >
                            <Icons.clock class="h-5 w-5 mr-3 text-secondary" />
                            <div>
                                <p class="text-sm text-fr/70">Duration</p>
                                <p class="font-medium">{activity.duration}</p>
                            </div>
                        </div>

                        {#if activity.location}
                            <div
                                class="flex items-center p-4 rounded-xl bg-primary-50/30 dark:bg-primary-50/5"
                            >
                                <Icons.mapPin
                                    class="h-5 w-5 mr-3 text-secondary"
                                />
                                <div>
                                    <p class="text-sm text-fr/70">Location</p>
                                    <p class="font-medium">
                                        {activity.location}
                                    </p>
                                </div>
                            </div>
                        {/if}

                        {#if activity.major}
                            <div
                                class="flex items-center p-4 rounded-xl bg-primary-50/30 dark:bg-primary-50/5"
                            >
                                <Icons.graduationCap
                                    class="h-5 w-5 mr-3 text-secondary"
                                />
                                <div>
                                    <p class="text-sm text-fr/70">Major</p>
                                    <p class="font-medium">
                                        {activity.major.title}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                {#if activity.description}
                    <div
                        id="details"
                        class="detail-section p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-500"
                        class:shadow-lg={activeSection === "details"}
                        in:fade={{ duration: 300, delay: 500 }}
                    >
                        <h2 class="text-2xl font-bold mb-4 flex items-center">
                            <Icons.fileText class="h-6 w-6 mr-2 text-primary" />
                            Detailed Information
                        </h2>
                        <div
                            class="prose prose-sm sm:prose dark:prose-invert max-w-none"
                        >
                            <p>{activity.description}</p>
                        </div>
                    </div>
                {/if}

                {#if activity.requirements && activity.requirements.length > 0}
                    <div
                        id="requirements"
                        class="detail-section p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-500"
                        class:shadow-lg={activeSection === "requirements"}
                        in:fade={{ duration: 300, delay: 600 }}
                    >
                        <h2 class="text-2xl font-bold mb-4 flex items-center">
                            <Icons.check class="h-6 w-6 mr-2 text-primary" />
                            Requirements
                        </h2>
                        <ul class="space-y-4">
                            {#each activity.requirements as req}
                                <li
                                    class="flex items-start p-4 rounded-xl bg-primary-50/30 dark:bg-primary-50/5"
                                >
                                    <div
                                        class="mt-0.5 p-1 bg-primary-50 rounded-full text-secondary mr-3"
                                    >
                                        <Icons.check class="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{req.title}</p>
                                        {#if req.details}
                                            <p class="text-sm text-fr/70 mt-1">
                                                {req.details}
                                            </p>
                                        {/if}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if activity.languageRequirements && activity.languageRequirements.length > 0}
                    <div
                        id="languages"
                        class="detail-section p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-500"
                        class:shadow-lg={activeSection === "languages"}
                        in:fade={{ duration: 300, delay: 700 }}
                    >
                        <h2 class="text-2xl font-bold mb-4 flex items-center">
                            <Icons.chat class="h-6 w-6 mr-2 text-primary" />
                            Language Requirements
                        </h2>
                        <ul class="space-y-4">
                            {#each activity.languageRequirements as lang}
                                <li
                                    class="flex items-start p-4 rounded-xl bg-primary-50/30 dark:bg-primary-50/5"
                                >
                                    <div
                                        class="mt-0.5 p-1 bg-primary-50 rounded-full text-secondary mr-3"
                                    >
                                        <Icons.check class="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p class="font-medium">
                                            {lang.name} - {lang.level}
                                        </p>
                                        {#if lang.details}
                                            <p class="text-sm text-fr/70 mt-1">
                                                {lang.details}
                                            </p>
                                        {/if}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>

            <!-- Right sidebar -->
            <div class="md:col-span-1">
                <div
                    class="sticky top-24 space-y-6"
                    in:fly={{ x: 20, duration: 400, delay: 300 }}
                >
                    <!-- Creator info card -->
                    <div
                        class="p-5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                    >
                        <h3 class="text-lg font-semibold mb-4">
                            Activity Info
                        </h3>
                        <div class="flex items-center mb-4">
                            <div
                                class="p-3 rounded-full bg-primary-50/30 dark:bg-primary-50/10 mr-3"
                            >
                                <Icons.calendar
                                    class="h-5 w-5 text-secondary"
                                />
                            </div>
                            <div>
                                <p class="text-sm text-fr/70">Posted on</p>
                                <p class="font-medium">
                                    {formatDate(activity.createdAt)}
                                </p>
                            </div>
                        </div>

                        {#if activity.link}
                            <div class="mb-2">
                                <a
                                    href={activity.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="w-full mt-3 flex items-center justify-center px-4 py-2 bg-secondary hover:bg-secondary-soft rounded-lg transition-colors"
                                >
                                    <Icons.externalLink class="h-4 w-4 mr-2" />
                                    Visit Website
                                </a>
                            </div>
                        {/if}

                        <CrButton variant="outline" class="w-full mt-3">
                            <Icons.share class="h-4 w-4 mr-2" />
                            Share Activity
                        </CrButton>
                    </div>

                    <!-- Navigation card -->
                    <div
                        class="p-5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                        transition:scale={{ duration: 300, delay: 400 }}
                    >
                        <h3 class="text-lg font-semibold mb-4">Navigate</h3>
                        <nav>
                            <ul class="space-y-2">
                                <li>
                                    <a
                                        href="#overview"
                                        class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                        class:text-secondary={activeSection ===
                                            "overview"}
                                    >
                                        <Icons.info class="h-4 w-4 mr-2" />
                                        Overview
                                    </a>
                                </li>
                                {#if activity.requirements && activity.requirements.length > 0}
                                    <li>
                                        <a
                                            href="#requirements"
                                            class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                            class:text-secondary={activeSection ===
                                                "requirements"}
                                        >
                                            <Icons.check class="h-4 w-4 mr-2" />
                                            Requirements
                                        </a>
                                    </li>
                                {/if}
                                {#if activity.languageRequirements && activity.languageRequirements.length > 0}
                                    <li>
                                        <a
                                            href="#languages"
                                            class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                            class:text-secondary={activeSection ===
                                                "languages"}
                                        >
                                            <Icons.chat class="h-4 w-4 mr-2" />
                                            Languages
                                        </a>
                                    </li>
                                {/if}
                            </ul>
                        </nav>
                    </div>

                    <!-- Similar activities card -->
                    <div
                        class="p-5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                        transition:scale={{ duration: 300, delay: 500 }}
                    >
                        <h3 class="text-lg font-semibold mb-4">Explore More</h3>
                        <div class="space-y-2">
                            <CrButton
                                variant="outline"
                                class="w-full justify-start"
                                onclick={() =>
                                    goto(
                                        "/activities?category=" +
                                            activity.category,
                                    )}
                            >
                                <Icons.grid class="h-4 w-4 mr-2" />
                                More {activity.category} activities
                            </CrButton>

                            {#if activity.major}
                                <CrButton
                                    variant="outline"
                                    class="w-full justify-start"
                                    onclick={() =>
                                        goto(
                                            "/activities?majorId=" +
                                                activity.major?.id,
                                        )}
                                >
                                    <Icons.graduationCap class="h-4 w-4 mr-2" />
                                    More {activity.major.title} activities
                                </CrButton>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <!-- Loading state -->
        <div class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin">
                <Icons.spinner class="h-10 w-10 text-secondary" />
            </div>
            <p class="mt-4 text-fr/70">Loading activity details...</p>
        </div>
    {/if}
</main>

<style>
    .pattern-grid {
        background-image: linear-gradient(
                to right,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 1px
            );
        background-size: 20px 20px;
    }

    /* Smooth scroll behavior */
    :global(html) {
        scroll-behavior: smooth;
    }

    /* Animation for active section */
    .detail-section.shadow-lg {
        transform: translateY(-2px);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
</style>
