<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";

	interface Activity {
		id: string;
		title?: string;
		description?: string;
		location?: string;
		startDate: string;
		endDate: string;
		category?:
			| "internship"
			| "course"
			| "travel"
			| "volunteering"
			| "other";
		tags?: string[];
		createdAt: string;
		updatedAt: string;
	}

	let { data } = $props();

	let activities = $state<Activity[]>(data.activities || []);
	let isAddingActivity = $state(false);

	let newActivity = $state({
		title: "",
		description: "",
		location: "",
		startDate: new Date().toISOString().split("T")[0],
		endDate: new Date().toISOString().split("T")[0],
		category: "other",
		tags: "",
	});

	let errors: { [key: string]: string } = $state({});
	let successMessage = $state("");

	const categories = [
		{ value: "internship", label: "Internship", icon: "briefcase" },
		{ value: "course", label: "Course", icon: "book" },
		{ value: "travel", label: "Travel", icon: "plane" },
		{ value: "volunteering", label: "Volunteering", icon: "heart" },
		{ value: "other", label: "Other", icon: "star" },
	];

	// Handle form submission
	async function handleSubmit() {
		// Reset errors
		errors = {};

		// Basic validation
		if (!newActivity.title) errors.title = "Title is required";
		if (!newActivity.description)
			errors.description = "Description is required";
		if (!newActivity.startDate) errors.startDate = "Start date is required";
		if (!newActivity.endDate) errors.endDate = "End date is required";

		// Check if there are any errors
		if (Object.keys(errors).length > 0) return;

		try {
			// Convert tags string to array
			const tagsArray = newActivity.tags
				? newActivity.tags
						.split(",")
						.map((tag) => tag.trim())
						.filter(Boolean)
				: [];

			// Prepare activity data
			const activityData = {
				...newActivity,
				tags: tagsArray,
			};

			// Send POST request
			const response = await fetch("/api/activities", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(activityData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Failed to create activity");
			}

			// Add the new activity to the list
			activities = [
				{
					...result.activity,
					id: result.activity._id,
				},
				...activities,
			];

			// Reset form
			newActivity = {
				title: "",
				description: "",
				location: "",
				startDate: new Date().toISOString().split("T")[0],
				endDate: new Date().toISOString().split("T")[0],
				category: "other",
				tags: "",
			};

			// Show success message
			successMessage = "Activity created successfully!";
			setTimeout(() => {
				successMessage = "";
				isAddingActivity = false;
			}, 3000);
		} catch (error: any) {
			console.error("Error creating activity:", error);
			errors["general"] = error.message || "Failed to create activity";
		}
	}

	// Get icon component based on category
	function getCategoryIcon(category: any) {
		const foundCategory = categories.find((c) => c.value === category);
		return foundCategory ? foundCategory.icon : "star";
	}
</script>

<Seo
	title="My Summer Activities"
	description="Manage your summer activities"
	keywords="summer activities, internships, courses, travels"
/>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold">My Summer Activities</h1>

		<button
			onclick={() => (isAddingActivity = !isAddingActivity)}
			class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
		>
			{#if isAddingActivity}
				<Icons.x class="w-5 h-5 mr-2" />
				Cancel
			{:else}
				<Icons.plus class="w-5 h-5 mr-2" />
				Add Activity
			{/if}
		</button>
	</div>

	{#if successMessage}
		<div
			class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
			role="alert"
		>
			<span class="block sm:inline">{successMessage}</span>
		</div>
	{/if}

	{#if isAddingActivity}
		<div class="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4">Add New Summer Activity</h2>

			<form onsubmit={handleSubmit} class="space-y-4">
				{#if errors["general"]}
					<div
						class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
						role="alert"
					>
						<span class="block sm:inline">{errors["general"]}</span>
					</div>
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Title -->
					<div>
						<label
							for="title"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Title *</label
						>
						<input
							type="text"
							id="title"
							bind:value={newActivity.title}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Summer internship at Google"
						/>
						{#if errors["title"]}
							<p class="mt-1 text-sm text-red-600">
								{errors["title"]}
							</p>
						{/if}
					</div>

					<!-- Location -->
					<div>
						<label
							for="location"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Location</label
						>
						<input
							type="text"
							id="location"
							bind:value={newActivity.location}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Mountain View, CA"
						/>
					</div>

					<!-- Category -->
					<div>
						<label
							for="category"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Category *</label
						>
						<select
							id="category"
							bind:value={newActivity.category}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{#each categories as category}
								<option value={category.value}
									>{category.label}</option
								>
							{/each}
						</select>
					</div>

					<!-- Tags -->
					<div>
						<label
							for="tags"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Tags (comma-separated)</label
						>
						<input
							type="text"
							id="tags"
							bind:value={newActivity.tags}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="tech, coding, silicon valley"
						/>
					</div>

					<!-- Start Date -->
					<div>
						<label
							for="startDate"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Start Date *</label
						>
						<input
							type="date"
							id="startDate"
							bind:value={newActivity.startDate}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{#if errors["startDate"]}
							<p class="mt-1 text-sm text-red-600">
								{errors["startDate"]}
							</p>
						{/if}
					</div>

					<!-- End Date -->
					<div>
						<label
							for="endDate"
							class="block text-sm font-medium text-gray-700 mb-1"
							>End Date *</label
						>
						<input
							type="date"
							id="endDate"
							bind:value={newActivity.endDate}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{#if errors["endDate"]}
							<p class="mt-1 text-sm text-red-600">
								{errors["endDate"]}
							</p>
						{/if}
					</div>
				</div>

				<!-- Description -->
				<div>
					<label
						for="description"
						class="block text-sm font-medium text-gray-700 mb-1"
						>Description *</label
					>
					<textarea
						id="description"
						bind:value={newActivity.description}
						rows="4"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Describe your summer activity..."
					></textarea>
					{#if errors["description"]}
						<p class="mt-1 text-sm text-red-600">
							{errors["description"]}
						</p>
					{/if}
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
					>
						Save Activity
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Activities List -->
	{#if activities.length === 0}
		<div class="bg-white rounded-lg shadow-md p-8 text-center">
			<div class="flex justify-center mb-4">
				<Icons.calendar class="w-16 h-16 text-gray-400" />
			</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">
				No activities found
			</h3>
			<p class="text-gray-500">
				Click the "Add Activity" button to create your first summer
				activity.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each activities as activity}
				<div
					class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
				>
					<div class="p-6">
						<div class="flex items-center justify-between mb-3">
							<span
								class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
							>
								{#if activity.category === "internship"}
									<Icons.briefcase class="w-4 h-4 mr-1" />
								{:else if activity.category === "course"}
									<Icons.book class="w-4 h-4 mr-1" />
								{:else if activity.category === "travel"}
									<Icons.plane class="w-4 h-4 mr-1" />
								{:else if activity.category === "volunteering"}
									<Icons.heart class="w-4 h-4 mr-1" />
								{:else}
									<Icons.star class="w-4 h-4 mr-1" />
								{/if}
								{activity?.category &&
									activity.category.charAt(0).toUpperCase() +
										activity.category.slice(1)}
							</span>

							<a
								href={`/activities/${activity.id}`}
								class="text-gray-500 hover:text-gray-700"
							>
								<Icons.edit class="w-5 h-5" />
							</a>
						</div>

						<h3 class="text-xl font-semibold text-gray-900 mb-2">
							{activity.title}
						</h3>

						{#if activity.location}
							<div class="flex items-center text-gray-500 mb-2">
								<Icons.mapPin class="w-4 h-4 mr-2" />
								<span>{activity.location}</span>
							</div>
						{/if}

						<div class="flex items-center text-gray-500 mb-4">
							<Icons.calendar class="w-4 h-4 mr-2" />
							<span
								>{activity.startDate} - {activity.endDate}</span
							>
						</div>

						<p class="text-gray-600 mb-4 line-clamp-3">
							{activity.description}
						</p>

						{#if activity.tags && activity.tags.length > 0}
							<div class="flex flex-wrap gap-2 mt-3">
								{#each activity.tags as tag}
									<span
										class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
									>
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
