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
	let showFilters = $state(false);

	// Filter states
	let filterCategory = $state<string>("all");
	let filterMajor = $state<string>("all");
	let filterSearch = $state<string>("");
	let filterUserActivities = $state<boolean>(false);

	// Computed filtered activities
	$effect(() => {
		let filtered = [...data.activities];

		// Filter by category
		if (filterCategory !== "all") {
			filtered = filtered.filter((a) => a.category === filterCategory);
		}

		// Filter by major
		if (filterMajor !== "all") {
			filtered = filtered.filter((a) => a.major?.id === filterMajor);
		}

		// Filter by search term
		if (filterSearch.trim()) {
			const searchLower = filterSearch.toLowerCase();
			filtered = filtered.filter(
				(a) =>
					a.title.toLowerCase().includes(searchLower) ||
					a.description.toLowerCase().includes(searchLower) ||
					a.location?.toLowerCase().includes(searchLower) ||
					a.goodForWho?.toLowerCase().includes(searchLower),
			);
		}

		// Filter user's activities
		if (filterUserActivities) {
			filtered = filtered.filter(
				(a) => a.userId === data?.session.userId,
			);
		}

		activities = filtered;
	});

	let newMajorName = $state("");
	let showAddMajorForm = $state(false);
	let searchValue = $state("");

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
		{ value: "competition", label: "Competition" },
		{ value: "research", label: "Research" },
		{ value: "workshop", label: "Workshop" },
		{ value: "hackathon", label: "Hackathon" },
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

	function toggleFilters() {
		showFilters = !showFilters;
	}

	function clearFilters() {
		filterCategory = "all";
		filterMajor = "all";
		filterSearch = "";
		filterUserActivities = false;
	}
</script>

<Seo
	title="Suggested Activities"
	description="Manage your summer activities"
	keywords="summer activities, internships, courses, travels"
/>

<div class="container mx-auto px-4 py-8">
	<div class="flex flex-col md:flex-row items-center justify-between mb-4">
		<h1 class="md:text-4xl text-2xl font-bold flex-1">Summer Activities</h1>

		<div class="flex items-center gap-4">
			<CrButton
				size="icon"
				class="text-sm"
				variant="outline"
				onclick={toggleFilters}
			>
				<Icons.filter class="w-5 h-5" />
			</CrButton>
			<CrButton
				class="text-sm"
				variant="default"
				onclick={() => (isAddingActivity = !isAddingActivity)}
			>
				{#if isAddingActivity}
					<Icons.x class="w-5 h-5 mr-2" />
					Cancel
				{:else}
					<Icons.plus class="w-5 h-5 mr-2" />
					Add Activity
				{/if}
			</CrButton>
		</div>
	</div>

	{#if successMessage}
		<div
			class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm transform transition-all duration-300 animate-in fade-in slide-in-from-top"
			role="alert"
		>
			<span class="block sm:inline">{successMessage}</span>
		</div>
	{/if}

	{#if showFilters}
		<div
			class="bg-white/80 backdrop-blur-md backdrop-saturate-150 rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 transform animate-in fade-in slide-in-from-top-5 border border-gray-100/50"
			style="--tw-enter-duration: 400ms;"
		>
			<div class="flex items-center justify-between mb-4">
				<h2
					class="text-lg font-semibold text-gray-800 flex items-center"
				>
					<Icons.sliders class="w-5 h-5 mr-2 text-blue-500" />
					Filter Activities
				</h2>
				<button
					onclick={clearFilters}
					class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center"
				>
					<Icons.refresh class="w-4 h-4 mr-1" />
					Reset Filters
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
				<div class="space-y-2">
					<label
						for="filterCategory"
						class="text-sm font-medium text-gray-700 mb-1 flex items-center"
					>
						<Icons.tag class="w-4 h-4 mr-1 text-gray-500" />
						Category
					</label>
					<div class="relative">
						<select
							id="filterCategory"
							bind:value={filterCategory}
							class="appearance-none w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 bg-white shadow-sm hover:shadow-md"
						>
							<option value="all">All Categories</option>
							<option value="internship">Internship</option>
							<option value="course">Course</option>
							<option value="travel">Travel</option>
							<option value="volunteering">Volunteering</option>
							<option value="research">Research</option>
							<option value="workshop">Workshop</option>
							<option value="hackathon">Hackathon</option>
							<option value="other">Other</option>
						</select>
						<div
							class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"
						>
							{#if filterCategory === "internship"}
								<Icons.briefcase class="w-5 h-5" />
							{:else if filterCategory === "course"}
								<Icons.book class="w-5 h-5" />
							{:else if filterCategory === "travel"}
								<Icons.plane class="w-5 h-5" />
							{:else if filterCategory === "volunteering"}
								<Icons.heart class="w-5 h-5" />
							{:else if filterCategory === "other"}
								<Icons.star class="w-5 h-5" />
							{:else}
								<Icons.grid class="w-5 h-5" />
							{/if}
						</div>
						<div
							class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"
						>
							<Icons.chevronsUpDown class="w-4 h-4" />
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<label
						for="filterMajor"
						class="flex text-sm font-medium text-gray-700 mb-1 items-center"
					>
						<Icons.graduationCap
							class="w-4 h-4 mr-1 text-gray-500"
						/>
						Major
					</label>
					<div class="relative">
						<select
							id="filterMajor"
							bind:value={filterMajor}
							class="appearance-none w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 bg-white shadow-sm hover:shadow-md"
						>
							<option value="all">All Majors</option>
							{#each majors as major}
								<option value={major.id}>{major.title}</option>
							{/each}
						</select>
						<div
							class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"
						>
							<Icons.graduationCap class="w-5 h-5" />
						</div>
						<div
							class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"
						>
							<Icons.chevronsUpDown class="w-4 h-4" />
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<label
						for="filterSearch"
						class="text-sm font-medium text-gray-700 mb-1 flex items-center"
					>
						<Icons.search class="w-4 h-4 mr-1 text-gray-500" />
						Search
					</label>
					<div class="relative">
						<input
							type="text"
							id="filterSearch"
							placeholder="Search activities..."
							bind:value={filterSearch}
							class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 bg-white shadow-sm hover:shadow-md"
						/>
						<div
							class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"
						>
							<Icons.search class="w-5 h-5" />
						</div>
						{#if filterSearch}
							<button
								class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
								onclick={() => (filterSearch = "")}
							>
								<Icons.x class="w-4 h-4" />
							</button>
						{/if}
					</div>
				</div>
			</div>

			{#if data?.session?.userId}
				<div class="mt-4 pl-1">
					<label class="inline-flex items-center cursor-pointer">
						<div
							class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
						>
							<input
								type="checkbox"
								id="filterUserActivities"
								bind:checked={filterUserActivities}
								class="opacity-0 absolute w-0 h-0 peer"
							/>
							<div
								class="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"
							></div>
							<div
								class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform peer-checked:translate-x-4"
							></div>
						</div>
						<span class="text-sm text-gray-700"
							>Show only my activities</span
						>
					</label>
				</div>
			{/if}

			<div class="mt-4 flex items-center text-sm text-gray-600">
				<Icons.filter class="w-4 h-4 mr-1.5 text-blue-500" />
				<span class="font-medium"
					>Showing {" " + activities.length}</span
				>
				of {data.activities.length} activities
				{#if activities.length !== data.activities.length}
					<span
						class="ml-1.5 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
						>Filtered</span
					>
				{/if}
			</div>
		</div>
	{/if}

	{#if isAddingActivity}
		<div
			class="bg-white/80 backdrop-blur-md backdrop-saturate-150 rounded-lg shadow-lg p-6 mb-8 border border-gray-100/50"
		>
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
							class="block text-sm font-medium text-gray-700 mb-1"
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
							class="block text-sm font-medium text-gray-700 mb-1"
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
					<CrButton variant="primary" type="submit" class="mr-4">
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
				<ComponentCard title={activity.title}>
					<div class="px-2">
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
				</ComponentCard>
			{/each}
		</div>
	{/if}
</div>
