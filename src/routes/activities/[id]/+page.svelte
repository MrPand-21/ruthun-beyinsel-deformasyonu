<script lang="ts">
	import { onMount } from "svelte";
	import { onDestroy } from "svelte";
	import { page } from "$app/stores";
	import type { Course } from "$lib/types";
	import { fade, fly } from "svelte/transition";
	import { Calendar } from "lucide-svelte";
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";

	let activityId: string;
	let activity: Course; // Replace with the appropriate type
	let comments: any[] = []; // Replace with the appropriate type

	onMount(async () => {
		activityId = $page.params.id;

		// Fetch activity details and comments based on activityId
		const response = await fetch(`/api/activities/${activityId}`);
		const data = await response.json();
		activity = data.activity;
		comments = data.comments;
	});

	const addComment = async (event: CustomEvent) => {
		const newComment = event.detail;
		try {
			// Add API call here to save the comment
			comments = [...comments, newComment];
		} catch (error) {
			console.error("Failed to add comment:", error);
		}
	};

	onDestroy(() => {
		// Cleanup if necessary
	});
</script>

<Seo
	title={activity?.title}
	description={activity?.description}
	keywords="activities, summer, courses"
/>

<main class="relative mx-auto max-w-5xl px-5 pb-40 sm:px-8">
	{#if activity}
		<div
			class="group relative mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
			in:fade={{ duration: 300 }}
		>
			<!-- Hero Image with Overlay -->
			<div class="relative h-64 w-full md:h-96">
				<img
					src={activity.imageUrl}
					alt={activity.title}
					class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
				></div>
			</div>

			<!-- Content -->
			<div class="relative -mt-20 space-y-6 px-6 pb-8">
				<!-- Title Card -->
				<div
					class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-700"
					in:fly={{ y: 50, duration: 400 }}
				>
					<h1
						class="text-3xl font-bold text-gray-900 dark:text-white"
					>
						{activity.title}
					</h1>
					<div
						class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300"
					>
						<div class="flex items-center gap-2">
							<Calendar class="h-4 w-4" />
							<span>12 March?</span>
						</div>
						<div class="flex items-center gap-2">
							<Icons.users class="h-4 w-4" />
							<span>4 participants</span>
						</div>
						<div class="flex items-center gap-2">
							<Icons.home class="h-4 w-4" />
							<span>Lokasyon</span>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div
					class="prose prose-lg max-w-none dark:prose-invert"
					in:fly={{ y: 50, duration: 500, delay: 200 }}
				>
					<p>{activity.description}</p>
				</div>

				<!-- Tags -->
				<div
					class="flex flex-wrap gap-2"
					in:fly={{ y: 50, duration: 600, delay: 300 }}
				>
					<span
						class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
					>
						a
					</span>
				</div>

				<!-- Action Buttons -->
				<div
					class="flex flex-wrap gap-4"
					in:fly={{ y: 50, duration: 700, delay: 400 }}
				>
					<button
						class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
					>
						<Icons.userPlus class="h-4 w-4" />
						Join Activity
					</button>
					<button
						class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
					>
						<Icons.share class="h-4 w-4" />
						Share
					</button>
				</div>
			</div>
		</div>
		<!-- <CommentForm 
			{activityId} 
			on:commentAdded={addComment} 
		/> -->
		<section class="mt-10">
			<h2 class="text-xl font-bold">Comments</h2>
			<ul class="space-y-4">
				{#each comments as comment}
					<li class="border p-4 rounded">
						<p><strong>{comment.author}</strong>: {comment.text}</p>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<div class="flex h-96 items-center justify-center">
			<div class="animate-pulse text-lg">Loading activity details...</div>
		</div>
	{/if}
</main>
