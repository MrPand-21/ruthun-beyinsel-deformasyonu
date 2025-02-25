<script lang="ts">
	import AppBackground from "$lib/components/AppBackground.svelte";
	import Seo from "$lib/components/SEO.svelte";
	import type { Activity } from "$lib/types";

	// Sample activities data
	let activities: Activity[] = [
		{
			id: 1,
			title: "Beach Cleanup",
			description:
				"Join us for a day of cleaning up the beach and enjoying the sun!",
			imageUrl: "",
		},
		{
			id: 2,
			title: "Summer Camp",
			description:
				"A week-long camp filled with fun activities and learning experiences.",
			imageUrl: "",
		},
		{
			id: 3,
			title: "Art Workshop",
			description: "Explore your creativity in our summer art workshop.",
			imageUrl: "",
		},
	];
</script>

<Seo
	title="Student Activities"
	description="Share and discover summer activities for students."
	keywords="summer activities, student activities, high school courses"
/>

<AppBackground />

<main class="relative mx-auto max-w-5xl px-5 pb-40 sm:px-8">
	<h1 class="text-3xl font-bold text-center mt-10">Summer Activities</h1>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each activities as activity}
			{#if activity}
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
					<img
						src={activity.imageUrl}
						alt={activity.title}
						class="w-full h-48 object-cover"
					/>
					<div class="p-4">
						<h3 class="text-xl font-semibold">{activity.title}</h3>
						<p class="mt-2 text-gray-600">{activity.description}</p>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</main>

<style>
	main {
		background-color: #f9fafb; /* Tailwind's gray-100 */
	}
</style>
