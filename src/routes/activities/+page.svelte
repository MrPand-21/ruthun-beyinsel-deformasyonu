<!-- svelte-ignore a11y_click_events_have_key_events -->
<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import ComponentCard from "$lib/components/ui/ComponentCard.svelte";
	import { Select, Combobox } from "bits-ui";
	import Palette from "phosphor-svelte/lib/Palette";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import Check from "phosphor-svelte/lib/Check";
	import type {
		Activity,
		ActivityDocument,
	} from "$lib/server/db/models/activity.model.js";
	import type { Major } from "$lib/server/db/models/major.model.js";
	import type { Requirement } from "$lib/server/db/models/requirement.model.js";
	import { superForm } from "sveltekit-superforms/client";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { formSchema } from "./schema";
	import { PieChart } from "lucide-svelte";
	import { cubicOut } from "svelte/easing";
	import CrButton from "$lib/components/ui/button/CrButton.svelte";

	let { data } = $props();

	let activities = $state<Activity[]>(data.activities);
	let majors = $state<Major[]>(data.majors || []);
	let requirements = $state<Requirement[]>(data.requirements || []);
	let isAddingActivity = $state(false);

	let searchValue = $state("");

	// New major form state
	let newMajorName = $state("");
	let showAddMajorForm = $state(false);

	// Requirement combobox state
	let requirementSearch = $state("");
	let filteredRequirements = $derived(
		requirements.filter((req) =>
			req.title.toLowerCase().includes(requirementSearch.toLowerCase()),
		),
	);

	let newActivity = $state({
		title: "",
		description: "",
		location: "",
		duration: "1 week",
		category: "other",
		major: undefined,
		requirements: [],
		cost: undefined,
		recommended: undefined,
		goodForWho: "",
		link: "",
		tags: "",
	});

	const formData = superForm(data.form, {
		taintedMessage: false, // Disable unsaved changes warning
		resetForm: true,
		dataType: "json",
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			if (result.type === "success") {
				successMessage = "Activity created successfully!";
				setTimeout(() => {
					successMessage = "";
					isAddingActivity = false;
				}, 1200);
			}
		},
	});

	const { form, enhance, errors, reset } = formData;

	let successMessage = $state("");

	const categories = [
		{ value: "internship", label: "Internship" },
		{ value: "course", label: "Course" },
		{ value: "travel", label: "Travel" },
		{ value: "volunteering", label: "Volunteering" },
		{ value: "other", label: "Other" },
	];

	let categoryValue = $state<string>("other");
	const selectedCategoryLabel = $derived(
		categoryValue
			? categories.find((cat) => cat.value === categoryValue)?.label
			: "Select a category",
	);

	$effect(() => {
		newActivity.category = categoryValue as any;
	});

	// Major selection state
	let majorSearch = $state("");
	let majorValue = $state<string | undefined>(undefined);

	$effect(() => {
		if (majorValue) {
			const selectedMajor = majors.find((m) => m.id === majorValue);
			if (selectedMajor) {
				$form.major = {
					_id: selectedMajor.id,
					title: selectedMajor.title,
				};
			}
		} else {
			$form.major = undefined;
		}
	});

	// Requirements combobox selection
	let selectedRequirements = $state<string[]>([]);

	$effect(() => {
		$form.requirements = selectedRequirements
			.map((reqId) => {
				const req = requirements.find((r) => r.id === reqId);
				return req ? { _id: req.id, title: req.title } : null;
			})
			.filter((req) => req !== null);
	});

	async function handleSubmit() {
		console.log("Submitting form...");
	}

	function autoScrollDelay(tick: number) {
		const maxDelay = 200;
		const minDelay = 25;
		const steps = 30;

		const progress = Math.min(tick / steps, 1);
		// Use the cubicOut easing function from svelte/easing
		return maxDelay - (maxDelay - minDelay) * cubicOut(progress);
	}

	function parseTags(tagsString: string): string[] {
		if (!tagsString) return [];
		return tagsString
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
	}
</script>

<Seo
	title="Suggested Activities"
	description="Manage your summer activities"
	keywords="summer activities, internships, courses, travels"
/>

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold">Summer Activities</h1>

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

			<form
				onsubmit={handleSubmit}
				use:enhance
				method="post"
				class="space-y-4"
			>
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
							name="title"
							bind:value={$form.title}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Summer internship at Google"
						/>
						{#if $errors.title}
							<p class="mt-1 text-sm text-red-600">
								{$errors.title}
							</p>
						{/if}
					</div>

					<div>
						<label
							for="location"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Location</label
						>
						<input
							type="text"
							id="location"
							name="location"
							bind:value={$form.location}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Mountain View, CA"
						/>
					</div>

					<div>
						<label
							for="category"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>Category *</label
						>
						<Select.Root
							type="single"
							onValueChange={(v) => (categoryValue = v)}
							items={categories}
							bind:value={$form.category}
						>
							<Select.Trigger
								class="h-input rounded-9px border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-full select-none items-center border px-[11px] text-sm transition-colors"
								aria-label="Select a category"
							>
								<PieChart
									class="text-muted-foreground mr-[9px] size-6"
								/>
								{selectedCategoryLabel}
								<CaretUpDown
									class="text-muted-foreground ml-auto size-6"
								/>
							</Select.Trigger>
							<Select.Portal>
								<Select.Content
									class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
									sideOffset={10}
								>
									<Select.ScrollUpButton
										class="flex w-full items-center justify-center"
									>
										<CaretDoubleUp class="size-3" />
									</Select.ScrollUpButton>
									<Select.Viewport class="p-1">
										{#each categories as category, i (i + category.value)}
											<Select.Item
												class="rounded-button data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
												value={category.value}
												label={category.label}
											>
												{#snippet children({
													selected,
												})}
													{category.label}
													{#if selected}
														<div class="ml-auto">
															<Check
																aria-label="check"
															/>
														</div>
													{/if}
												{/snippet}
											</Select.Item>
										{/each}
									</Select.Viewport>
									<Select.ScrollDownButton
										class="flex w-full items-center justify-center"
									>
										<CaretDoubleDown class="size-3" />
									</Select.ScrollDownButton>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					</div>

					<div>
						<label
							for="major"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>Major *</label
						>

						<Combobox.Root
							type="single"
							name="major"
							onOpenChange={(o) => {
								if (!o) searchValue = "";
							}}
						>
							<div class="relative w-full">
								<Icons.graduationCap
									class="text-muted-foreground absolute start-3 top-1/2 size-6 -translate-y-1/2"
								/>
								<Combobox.Input
									oninput={(e) =>
										(searchValue = e.currentTarget.value)}
									class="h-input rounded-9px border-border-input bg-background w-full
								 focus:ring-foreground focus:ring-offset-background focus:outline-hidden inline-flex truncate border px-11 text-base transition-colors focus:ring-2 focus:ring-offset-2 sm:text-sm"
									placeholder="Search a major"
									aria-label="Search a major"
								/>
								<Combobox.Trigger
									class="absolute end-3 top-1/2 size-6 -translate-y-1/2"
								>
									<CaretUpDown
										class="text-muted-foreground size-6"
									/>
								</Combobox.Trigger>
							</div>
							<Combobox.Portal>
								<Combobox.Content
									class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
									sideOffset={10}
								>
									<Combobox.ScrollUpButton
										class="flex w-full items-center justify-center py-1"
										delay={autoScrollDelay}
									>
										<CaretDoubleUp class="size-3" />
									</Combobox.ScrollUpButton>
									<Combobox.Viewport class="p-1">
										{#each data.majors as major, i (i + major.id)}
											<Combobox.Item
												class="rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
												value={major.id}
												label={major.title}
											>
												{#snippet children({
													selected,
												})}
													{major.title}
													{#if selected}
														<div class="ml-auto">
															<Check />
														</div>
													{/if}
												{/snippet}
											</Combobox.Item>
										{:else}
											<span
												class="block px-5 py-2 text-sm text-muted-foreground"
											>
												No results found, try again.
											</span>
										{/each}
									</Combobox.Viewport>
									<Combobox.ScrollDownButton
										class="flex w-full items-center justify-center py-1"
										delay={autoScrollDelay}
									>
										<CaretDoubleDown class="size-3" />
									</Combobox.ScrollDownButton>
								</Combobox.Content>
							</Combobox.Portal>
						</Combobox.Root>
					</div>
				</div>

				<div>
					<label
						for="duration"
						class="block text-sm font-medium text-gray-700 mb-1"
						>Duration *</label
					>
					<input
						type="text"
						id="duration"
						name="duration"
						bind:value={$form.duration}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="e.g., 8 weeks, 3 months"
					/>
					{#if $errors.duration}
						<p class="mt-1 text-sm text-red-600">
							{$errors.duration}
						</p>
					{/if}
				</div>

				<!-- Cost and Recommended -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							for="cost"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Cost (USD)</label
						>
						<input
							type="number"
							id="cost"
							name="cost"
							bind:value={$form.cost}
							min="0"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Cost in USD (optional)"
						/>
					</div>

					<div>
						<label
							for="recommended"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Recommended Rating (1-5)</label
						>
						<input
							type="number"
							id="recommended"
							name="recommended"
							bind:value={$form.recommended}
							min="1"
							max="5"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Rating from 1-5 (optional)"
						/>
					</div>
				</div>

				<!-- Good For Who and Link -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							for="goodForWho"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Good For Who</label
						>
						<input
							type="text"
							id="goodForWho"
							name="goodForWho"
							bind:value={$form.goodForWho}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., Computer Science students"
						/>
					</div>

					<div>
						<label
							for="link"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Link</label
						>
						<input
							type="url"
							id="link"
							name="link"
							bind:value={$form.link}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="https://example.com"
						/>
					</div>
				</div>

				<div>
					<!-- <label
						for="requirements"
						class="block text-sm font-medium text-gray-700 mb-1"
					>
						Requirements
					</label> -->
				</div>

				<!-- Description -->
				<div>
					<label
						for="description"
						class="block text-sm font-medium text-gray-700 mb-1"
						>What did it add to you or your application? (unique
						value) *</label
					>
					<textarea
						id="description"
						name="description"
						bind:value={$form.description}
						rows="4"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Describe your summer activity..."
					></textarea>
					{#if $errors.description}
						<p class="mt-1 text-sm text-red-600">
							{$errors.description}
						</p>
					{/if}
				</div>

				<div class="flex justify-end">
					<CrButton
						type="submit"
						onclick={() => (isAddingActivity = false)}
						class="mr-4"
					>
						Save Activity
					</CrButton>
				</div>
			</form>
		</div>
	{/if}

	<!-- Activities List -->
	{#if activities.length === 0}
		<ComponentCard>
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
		</ComponentCard>
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
								href={`/activities/${activity.id}/edit`}
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

						<div class="flex items-center text-gray-500 mb-2">
							<Icons.clock class="w-4 h-4 mr-2" />
							<span>{activity.duration}</span>
						</div>

						{#if activity.major}
							<div class="flex items-center text-gray-500 mb-2">
								<Icons.graduationCap class="w-4 h-4 mr-2" />
								<span>{activity.major.title}</span>
							</div>
						{/if}

						{#if activity.cost}
							<div class="flex items-center text-gray-500 mb-2">
								<Icons.dollarSign class="w-4 h-4 mr-2" />
								<span>${activity.cost}</span>
							</div>
						{/if}

						{#if activity.recommended}
							<div class="flex items-center text-gray-500 mb-2">
								<Icons.star class="w-4 h-4 mr-2" />
								<span>{activity.recommended}/5</span>
							</div>
						{/if}

						<p class="text-gray-600 mb-4 line-clamp-3">
							{activity.description}
						</p>

						{#if activity.requirements && activity.requirements.length > 0}
							<div class="mb-3">
								<h4
									class="text-sm font-semibold text-gray-700 mb-1"
								>
									Requirements:
								</h4>
								<ul
									class="text-sm text-gray-600 pl-5 list-disc"
								>
									{#each activity.requirements as req}
										<li>{req.title}</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if activity.goodForWho}
							<div class="mb-3">
								<h4
									class="text-sm font-semibold text-gray-700 mb-1"
								>
									Good for:
								</h4>
								<p class="text-sm text-gray-600">
									{activity.goodForWho}
								</p>
							</div>
						{/if}

						{#if activity.link}
							<div class="mb-3">
								<a
									href={activity.link}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-blue-600 hover:text-blue-800"
								>
									<Icons.externalLink class="w-4 h-4 mr-1" />
									Visit Website
								</a>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
