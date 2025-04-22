<script lang="ts">
	import { page } from "$app/stores";
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import { goto } from "$app/navigation";

	// Get activity from the page data
	let { data } = $props();

	let activity = $state(data.activity);
	let isEditing = $state(false);
	let isSaving = $state(false);
	let isDeleting = $state(false);

	// Form data for editing
	let editForm = $derived({
		title: activity.title,
		description: activity.description,
		location: activity.location || "",
		startDate: activity.startDate,
		endDate: activity.endDate,
		category: activity.category,
		tags: (activity.tags || []).join(", "),
	});

	// Form validation
	let errors: { [key: string]: string } = $state({});
	let successMessage = $state("");

	// Categories with icons
	const categories = [
		{ value: "internship", label: "Internship", icon: "briefcase" },
		{ value: "course", label: "Course", icon: "book" },
		{ value: "travel", label: "Travel", icon: "plane" },
		{ value: "volunteering", label: "Volunteering", icon: "heart" },
		{ value: "other", label: "Other", icon: "star" },
	];

	function getCategoryLabel(value: any) {
		const category = categories.find((c) => c.value === value);
		return category ? category.label : "Other";
	}

	// Handle form submission for updates
	async function handleUpdate() {
		// Reset errors
		errors = {};

		// Basic validation
		if (!editForm.title) errors["title"] = "Title is required";
		if (!editForm.description)
			errors["description"] = "Description is required";
		if (!editForm.startDate) errors["startDate"] = "Start date is required";
		if (!editForm.endDate) errors["endDate"] = "End date is required";

		// Check if there are any errors
		if (Object.keys(errors).length > 0) return;

		try {
			isSaving = true;

			// Convert tags string to array
			const tagsArray = editForm.tags
				? editForm.tags
						.split(",")
						.map((tag: any) => tag.trim())
						.filter(Boolean)
				: [];

			// Prepare activity data for update
			const activityData = {
				...editForm,
				tags: tagsArray,
			};

			// Send PUT request to update the activity
			const response = await fetch(`/api/activities/${activity.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(activityData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to update activity");
			}

			// Update local activity data
			activity = {
				...activity,
				...result.activity,
			};

			// Show success message
			successMessage = "Activity updated successfully!";
			setTimeout(() => {
				successMessage = "";
				isEditing = false;
			}, 2000);
		} catch (error: any) {
			console.error("Error updating activity:", error);
			errors["general"] = error.message || "Failed to update activity";
		} finally {
			isSaving = false;
		}
	}

	// Handle activity deletion
	async function handleDelete() {
		if (
			!confirm(
				"Are you sure you want to delete this activity? This action cannot be undone.",
			)
		) {
			return;
		}

		try {
			isDeleting = true;

			const response = await fetch(`/api/activities/${activity.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.error || "Failed to delete activity");
			}

			// Redirect to activities list
			goto("/activities");
		} catch (error: any) {
			console.error("Error deleting activity:", error);
			errors["general"] = error.message || "Failed to delete activity";
			isDeleting = false;
		}
	}
</script>

<Seo
	title={activity.title}
	description={activity.description.substring(0, 160)}
	keywords={activity.tags ? activity.tags.join(", ") : "summer activity"}
/>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<a
			href="/activities"
			class="text-blue-600 hover:text-blue-800 flex items-center"
		>
			<Icons.arrowLeft class="w-4 h-4 mr-1" />
			Back to Activities
		</a>
	</div>

	{#if successMessage}
		<div
			class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
			role="alert"
		>
			<span class="block sm:inline">{successMessage}</span>
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow-md overflow-hidden">
		<div class="p-6">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center">
					<span
						class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3"
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
						{getCategoryLabel(activity.category)}
					</span>

					<span class="text-gray-500 text-sm">
						Added on {new Date(
							activity.createdAt,
						).toLocaleDateString()}
					</span>
				</div>

				<div class="flex space-x-2">
					<button
						onclick={() => (isEditing = !isEditing)}
						class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
						aria-label={isEditing
							? "Cancel editing"
							: "Edit activity"}
					>
						{#if isEditing}
							<Icons.x class="w-5 h-5" />
						{:else}
							<Icons.edit class="w-5 h-5" />
						{/if}
					</button>

					<button
						onclick={handleDelete}
						disabled={isDeleting}
						class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
						aria-label="Delete activity"
					>
						{#if isDeleting}
							<Icons.loader class="w-5 h-5 animate-spin" />
						{:else}
							<Icons.trash class="w-5 h-5" />
						{/if}
					</button>
				</div>
			</div>

			{#if isEditing}
				<!-- Edit Form -->
				<form onsubmit={handleUpdate} class="space-y-4">
					{#if errors["general"]}
						<div
							class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
							role="alert"
						>
							<span class="block sm:inline"
								>{errors["general"]}</span
							>
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
								bind:value={editForm.title}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
								bind:value={editForm.location}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
								bind:value={editForm.category}
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
								bind:value={editForm.tags}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
								bind:value={editForm.startDate}
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
								bind:value={editForm.endDate}
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
							bind:value={editForm.description}
							rows="6"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						></textarea>
						{#if errors["description"]}
							<p class="mt-1 text-sm text-red-600">
								{errors["description"]}
							</p>
						{/if}
					</div>

					<div class="flex justify-end space-x-3">
						<button
							type="button"
							onclick={() => (isEditing = false)}
							class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSaving}
							class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center"
						>
							{#if isSaving}
								<Icons.loader
									class="w-4 h-4 mr-2 animate-spin"
								/>
							{/if}
							Save Changes
						</button>
					</div>
				</form>
			{:else}
				<!-- Activity Details View -->
				<div class="space-y-6">
					<h1 class="text-3xl font-bold text-gray-900">
						{activity.title}
					</h1>

					<div class="flex flex-col space-y-3">
						{#if activity.location}
							<div class="flex items-center text-gray-600">
								<Icons.mapPin
									class="w-5 h-5 mr-2 text-gray-500"
								/>
								<span>{activity.location}</span>
							</div>
						{/if}

						<div class="flex items-center text-gray-600">
							<Icons.calendar
								class="w-5 h-5 mr-2 text-gray-500"
							/>
							<span>
								{new Date(
									activity.startDate,
								).toLocaleDateString()} - {new Date(
									activity.endDate,
								).toLocaleDateString()}
							</span>
						</div>
					</div>

					<div class="prose max-w-none">
						<p class="whitespace-pre-line">
							{activity.description}
						</p>
					</div>

					{#if activity.tags && activity.tags.length > 0}
						<div class="flex flex-wrap gap-2 pt-4">
							{#each activity.tags as tag}
								<span
									class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
								>
									{tag}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
