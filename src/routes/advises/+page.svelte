<script lang="ts">
    import { onMount } from "svelte";
    import { fly, fade } from "svelte/transition";
    import Seo from "$lib/components/SEO.svelte";
    import { Icons } from "$lib/components/icons";
    import AppBackground from "$lib/components/AppBackground.svelte";

    // Categories for the guides
    const categories = [
        {
            id: "application",
            name: "Application Process",
            icon: Icons.documents,
            color: "from-amber-400 to-amber-600",
        },
        {
            id: "academic",
            name: "Academic Advice",
            icon: Icons.book,
            color: "from-indigo-400 to-indigo-600",
        },
        {
            id: "career",
            name: "Career Planning",
            icon: Icons.userPlus,
            color: "from-secondary to-secondary-soft",
        },
        {
            id: "personal",
            name: "Personal Development",
            icon: Icons.star,
            color: "from-sky-400 to-sky-600",
        },
    ];

    // Mock guides data - would be fetched from API in a real app
    const guides = [
        {
            id: 1,
            title: "Common App Essay Tips",
            description:
                "Learn how to craft compelling personal statements that stand out to admissions officers.",
            category: "application",
            image: "https://via.placeholder.com/300x200",
            readTime: "8 min read",
            popularity: "Popular",
        },
        {
            id: 2,
            title: "Reaching Out to Academics",
            description:
                "How to write effective emails to professors and researchers for mentorship opportunities.",
            category: "academic",
            image: "https://via.placeholder.com/300x200",
            readTime: "5 min read",
        },
        {
            id: 3,
            title: "Summer Research Programs Guide",
            description:
                "Everything you need to know about finding and applying to summer research opportunities.",
            category: "academic",
            image: "https://via.placeholder.com/300x200",
            readTime: "12 min read",
            popularity: "Trending",
        },
        {
            id: 4,
            title: "STEM vs Humanities: Which Path?",
            description:
                "A balanced perspective on choosing between STEM and humanities career paths.",
            category: "career",
            image: "https://via.placeholder.com/300x200",
            readTime: "10 min read",
        },
        {
            id: 5,
            title: "Portfolio Building for Arts Students",
            description:
                "Tips for creating a standout arts portfolio for college applications.",
            category: "application",
            image: "https://via.placeholder.com/300x200",
            readTime: "7 min read",
        },
        {
            id: 6,
            title: "Effective Study Techniques",
            description:
                "Science-backed methods to improve retention and make studying more productive.",
            category: "personal",
            image: "https://via.placeholder.com/300x200",
            readTime: "6 min read",
            popularity: "Popular",
        },
    ];

    let activeCategory = "all";
    let filteredGuides = guides;
    let searchQuery = "";

    $: {
        filteredGuides = guides.filter((guide) => {
            const matchesCategory =
                activeCategory === "all" || guide.category === activeCategory;
            const matchesSearch =
                !searchQuery ||
                guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }

    function setCategory(category: string) {
        activeCategory = category;
    }
</script>

<Seo
    title="Academic & Application Guides"
    description="Explore guides and advice for students on applications, academics, and career planning"
    keywords="student advice, application tips, academic guidance, career planning, college preparation"
/>

<AppBackground />

<main class="relative mx-auto max-w-7xl px-5 pb-40 sm:px-8">
    <!-- Hero Section -->
    <div class="text-center mb-12 mt-8" in:fade={{ duration: 700, delay: 200 }}>
        <h1 class="text-4xl font-bold mb-4">Student Guides & Advice</h1>
        <p class="text-fr/80 dark:text-fr/70 max-w-2xl mx-auto">
            Learn from the experiences of those who've been there. Browse our
            collection of guides, tips, and insights to help you navigate
            academics, applications, and beyond.
        </p>
    </div>

    <!-- Search and Filter -->
    <div
        class="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center"
        in:fade={{ duration: 700, delay: 400 }}
    >
        <div class="relative w-full md:w-64">
            <input
                type="text"
                placeholder="Search guides..."
                bind:value={searchQuery}
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 ring-amber-400/50"
            />
            <Icons.search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            />
        </div>

        <div
            class="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 hide-scrollbar"
        >
            <button
                class="px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300
                       {activeCategory === 'all'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700'}"
                on:click={() => setCategory("all")}
            >
                All Guides
            </button>
            {#each categories as category}
                <button
                    class="px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300 flex items-center
                          {activeCategory === category.id
                        ? 'bg-gradient-to-r ' +
                          category.color +
                          ' text-white shadow-lg'
                        : 'bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700'}"
                    on:click={() => setCategory(category.id)}
                >
                    <svelte:component
                        this={category.icon}
                        class="h-4 w-4 mr-2"
                    />
                    {category.name}
                </button>
            {/each}
        </div>
    </div>

    <!-- Guides Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredGuides as guide, i}
            <a
                href={`/advises/${guide.id}`}
                class="guide-card group relative overflow-hidden rounded-xl bg-white/90 dark:bg-gray-800/90
                       border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg
                       transition-all duration-300 hover:-translate-y-1"
                in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
            >
                <div class="aspect-video overflow-hidden">
                    <!-- Replace with real images -->
                    <div
                        class="w-full h-48 bg-gradient-to-br
                        {guide.category === 'application'
                            ? 'from-amber-300 to-amber-500'
                            : guide.category === 'academic'
                              ? 'from-indigo-300 to-indigo-600'
                              : guide.category === 'career'
                                ? 'from-secondary/70 to-secondary'
                                : 'from-sky-300 to-sky-600'}
                        relative overflow-hidden"
                    >
                        <div
                            class="absolute inset-0 opacity-50 mix-blend-overlay"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                            >
                                <defs>
                                    <pattern
                                        id="pattern"
                                        width="40"
                                        height="40"
                                        patternUnits="userSpaceOnUse"
                                    >
                                        <path
                                            d="M0 20 L40 20 M20 0 L20 40"
                                            stroke="white"
                                            stroke-width="0.5"
                                        ></path>
                                    </pattern>
                                </defs>
                                <rect
                                    width="100%"
                                    height="100%"
                                    fill="url(#pattern)"
                                ></rect>
                            </svg>
                        </div>

                        {#if guide.category === "application"}
                            <Icons.documents
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white opacity-25"
                            />
                        {:else if guide.category === "academic"}
                            <Icons.book
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white opacity-25"
                            />
                        {:else if guide.category === "career"}
                            <Icons.userPlus
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white opacity-25"
                            />
                        {:else}
                            <Icons.star
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white opacity-25"
                            />
                        {/if}
                    </div>
                </div>

                <div class="p-5">
                    <div class="flex justify-between items-start mb-2">
                        <h3
                            class="text-xl font-bold group-hover:text-secondary transition-colors duration-300"
                        >
                            {guide.title}
                        </h3>
                        {#if guide.popularity}
                            <span
                                class="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium"
                            >
                                {guide.popularity}
                            </span>
                        {/if}
                    </div>
                    <p class="text-fr/70 dark:text-fr/60 text-sm mb-4">
                        {guide.description}
                    </p>
                    <div
                        class="flex justify-between items-center text-xs text-gray-500"
                    >
                        <div class="flex items-center">
                            <Icons.clock class="h-3 w-3 mr-1" />
                            <span>{guide.readTime}</span>
                        </div>
                        <span
                            class="flex items-center group-hover:translate-x-1 transition-transform duration-300"
                        >
                            Read more <Icons.arrowRight class="h-3 w-3 ml-1" />
                        </span>
                    </div>
                </div>

                <!-- Category badge -->
                <div
                    class="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                           text-xs font-medium shadow-sm flex items-center gap-1"
                >
                    {#if guide.category === "application"}
                        <Icons.documents class="h-3 w-3 text-amber-500" />
                        <span class="text-amber-600 dark:text-amber-400"
                            >Application</span
                        >
                    {:else if guide.category === "academic"}
                        <Icons.book class="h-3 w-3 text-indigo-500" />
                        <span class="text-indigo-600 dark:text-indigo-400"
                            >Academic</span
                        >
                    {:else if guide.category === "career"}
                        <Icons.userPlus class="h-3 w-3 text-secondary" />
                        <span class="text-secondary">Career</span>
                    {:else}
                        <Icons.star class="h-3 w-3 text-sky-500" />
                        <span class="text-sky-600 dark:text-sky-400"
                            >Personal</span
                        >
                    {/if}
                </div>
            </a>
        {/each}
    </div>

    <!-- No results message -->
    {#if filteredGuides.length === 0}
        <div class="text-center py-12" in:fade>
            <Icons.triangleAlert
                class="h-12 w-12 mx-auto text-amber-500 mb-4"
            />
            <h3 class="text-xl font-medium mb-2">No guides found</h3>
            <p class="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
            </p>
            <button
                class="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                on:click={() => {
                    searchQuery = "";
                    activeCategory = "all";
                }}
            >
                Clear Filters
            </button>
        </div>
    {/if}
</main>

<style>
    /* Hide scrollbar but maintain functionality */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* Add some depth to the cards */
    .guide-card {
        backdrop-filter: blur(8px);
    }
</style>
