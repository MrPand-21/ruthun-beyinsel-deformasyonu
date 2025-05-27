<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import ComponentCard from "$lib/components/ui/ComponentCard.svelte";
	import { Select, Combobox } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import Check from "phosphor-svelte/lib/Check";
	import type { Activity } from "$lib/server/db/models/activity.model.js";
	import type { Major } from "$lib/server/db/models/major.model.js";
	import type { Requirement } from "$lib/server/db/models/requirement.model.js";
	import { superForm } from "sveltekit-superforms/client";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { formSchema } from "./schema";
	import { PieChart } from "lucide-svelte";
	import { cubicOut } from "svelte/easing";
	import CrButton from "$lib/components/ui/button/CrButton.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import CrInput from "$lib/components/ui/input/CrInput.svelte";
	import Dropdown from "$lib/components/ui/dropdown/Dropdown.svelte";
	import { fly, fade } from "svelte/transition";

	let { data } = $props();

	let activities = $state<Activity[]>(data.activities);
	let majors = $state<Major[]>(data.majors || []);
	let requirements = $state<Requirement[]>(data.requirements || []);
	let isAddingActivity = $state(false);
	let showFilters = $state(true); // Show filters by default

	// Layout switcher state
	let layoutType = $state("grid"); // Options: grid, list, cards, book

	// Layout options
	const layoutOptions = [
		{ id: "grid", icon: "grid", label: "Grid layout" },
		{ id: "list", icon: "list", label: "List layout" },
		{ id: "cards", icon: "masonry", label: "Card layout" },
		{ id: "book", icon: "book", label: "Book layout" },
	];

	let filterCategory = $state<string>("all");
	let filterMajor = $state<string>("all");
	let filterSearch = $state<string>("");
	let filterUserActivities = $state<boolean>(false);

	// Category quick filters
	let activeCategory = $state<string>("all");
	const categoryFilters = [
		{ id: "all", name: "All", icon: Icons.grid },
		{
			id: "internship",
			name: "Internships",
			icon: Icons.briefcase,
			color: "bg-fuchsia-500/40",
		},
		{
			id: "course",
			name: "Courses",
			icon: Icons.book,
			color: "bg-teal-500/40",
		},
		{
			id: "volunteering",
			name: "Volunteering",
			icon: Icons.heart,
			color: "bg-amber-500/40",
		},
		{
			id: "travel",
			name: "Travel",
			icon: Icons.plane,
			color: "bg-rose-500/40",
		},
		{
			id: "research",
			name: "Research",
			icon: Icons.search,
			color: "bg-blue-500/40",
		},
	];

	function setCategory(category: string) {
		activeCategory = category;
		filterCategory = category;
	}

	function setLayout(layout: string) {
		layoutType = layout;
	}

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

	let isReqOpen = $state(false);
	let searchValue = $state("");

	let requirementSearch = $state("");

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
		year: undefined,
	});

	let newLanguageReq = $state({
		_id: "",

		name: "",
		level: "",
		details: "",
	});

	let newTestReq = $state({
		_id: "",
		name: "",
		score: 0,
		details: "",
	});

	let newGradeReq = $state({
		_id: "",

		type: "",
		value: "",
		details: "",
	});

	function addLanguageRequirement() {
		$form.languageRequirements = [
			...(Array.isArray($form.languageRequirements)
				? $form.languageRequirements
				: []),
			{ ...newLanguageReq },
		];
		newLanguageReq = { _id: "", name: "", level: "", details: "" };
	}

	function addTestRequirement() {
		$form.testRequirements = [
			...(Array.isArray($form.testRequirements)
				? $form.testRequirements
				: []),
			{ ...newTestReq },
		];

		newTestReq = { _id: "", name: "", score: 0, details: "" };
	}

	function addGradeRequirement() {
		$form.gradeRequirements = [
			...(Array.isArray($form.gradeRequirements)
				? $form.gradeRequirements
				: []),
			{ ...newGradeReq },
		];
		newGradeReq = { _id: "", type: "", value: "", details: "" };
	}

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
	description="Explore summer activities, internships, courses, and more"
	keywords="summer activities, internships, courses, travels"
/>

<div class="container mx-auto px-4 py-8">
	{#if successMessage}
		<div
			class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm transform transition-all duration-300 animate-in fade-in slide-in-from-top"
			role="alert"
		>
			<span class="block sm:inline">{successMessage}</span>
		</div>
	{/if}

	<div
		class="mb-4 w-full flex justify-between"
		in:fade={{ duration: 300, delay: 200 }}
	>
		<div class="flex overflow-x-auto gap-3 pb-3 hide-scrollbar">
			{#each categoryFilters as category}
				<button
					class="px-4 py-3 rounded-md hover:cursor-pointer whitespace-nowrap transition-all duration-300 flex items-center
                          {activeCategory === category.id
						? (category.color ||
								' bg-stone-900/60 text-slate-50 ') +
							'  shadow-md'
						: 'bg-fr border border-gray-200 dark:border-gray-700 hover:border-purple-300'}"
					onclick={() => setCategory(category.id)}
				>
					<svelte:component
						this={category.icon}
						class="h-5 w-5 mr-3"
					/>
					{category.name}
				</button>
			{/each}
		</div>

		<div class="flex items-start justify-start gap-1 p-1 rounded-lg">
			<button
				class="p-2 rounded-md hover:cursor-pointer transition-all {layoutType ===
				'grid'
					? ' bg-slate-50 dark:bg-gray-700/60'
					: ' hover:bg-teal-500/80 dark:hover:bg-gray-700/50'}"
				title="Grid layout"
				onclick={() => setLayout("grid")}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
					/>
				</svg>
			</button>
			<button
				class="p-2 rounded-md hover:cursor-pointer transition-all {layoutType ===
				'list'
					? ' bg-slate-50 dark:bg-gray-700/60'
					: ' hover:bg-teal-500/80 dark:hover:bg-gray-700/50'}"
				title="List layout"
				onclick={() => setLayout("list")}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
			<button
				class="p-2 rounded-md hover:cursor-pointer transition-all {layoutType ===
				'cards'
					? ' bg-slate-50 dark:bg-gray-700/60'
					: ' hover:bg-teal-500/80 dark:hover:bg-gray-700/50'}"
				title="Cards layout"
				onclick={() => setLayout("cards")}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			</button>
			<button
				class="p-2 rounded-md hover:cursor-pointer transition-all {layoutType ===
				'book'
					? ' bg-slate-50 dark:bg-gray-700/60'
					: ' hover:bg-teal-500/80 dark:hover:bg-gray-700/50'}"
				title="Book layout"
				onclick={() => setLayout("book")}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
			</button>
		</div>
	</div>

	<Card className="mb-6 flex flex-col gap-4">
		<div class="flex items-center justify-between" onclick={toggleFilters}>
			<h2
				class="text-lg font-semibold text-gray-800 dark:text-gray-400 flex items-center"
			>
				<Icons.sliders class="w-5 h-5 mr-2 text-blue-500" />
				Advanced Filters
			</h2>
			<div class="flex items-center gap-2">
				<button
					onclick={clearFilters}
					class="text-blue-600 hover:cursor-pointer hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center"
				>
					<Icons.refresh class="w-4 h-4 mr-1" />
					Reset Filters
				</button>
				<button
					class="text-blue-600 hover:cursor-pointer hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center"
					onclick={() => (isAddingActivity = !isAddingActivity)}
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
		</div>

		{#if showFilters}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-5">
				<div class="relative">
					<select
						id="filterMajor"
						bind:value={filterMajor}
						class="appearance-none w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
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

				<div class="relative">
					<input
						type="text"
						id="filterSearch"
						placeholder="Search activities..."
						bind:value={filterSearch}
						class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
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

				{#if data?.session?.userId}
					<div class="mt-4 pl-1 md:mt-0 flex items-center">
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
									class="w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"
								></div>
								<div
									class="absolute bg-amber-400 left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 transform peer-checked:translate-x-4"
								></div>
							</div>
							<span class="text-sm text-gray-700"
								>My activities only</span
							>
						</label>
					</div>
				{/if}
			</div>
		{/if}

		<div class="flex items-center text-sm text-gray-600">
			<Icons.filter class="w-4 h-4 mr-1.5 text-blue-500" />
			<span class="font-medium"
				>Showing {" " + activities.length + " "}</span
			>
			of {data.activities.length} activities
			{#if activities.length !== data.activities.length}
				<span
					class="ml-1.5 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
					>Filtered</span
				>
			{/if}
		</div>
	</Card>

	{#if isAddingActivity}
		<div
			class="backdrop-blur-md backdrop-saturate-150 rounded-lg shadow-lg p-6 mb-8 border border-gray-100/50"
			in:fade={{ duration: 300 }}
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
							for="year"
							class="block text-sm font-medium text-gray-700 mb-1"
							>Year</label
						>
						<input
							type="number"
							id="year"
							name="year"
							bind:value={$form.year}
							min="1900"
							max="2100"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Academic year (optional)"
						/>
						{#if $errors.year}
							<p class="mt-1 text-sm text-red-600">
								{$errors.year}
							</p>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					<Dropdown
						className=""
						title="Requirements"
						bind:isOpen={isReqOpen}
						onClose={() => (isReqOpen = false)}
					>
						<div class="mb-4 p-4 bg-gray-50 border rounded-md">
							<h3
								class="text-md font-semibold mb-3 flex items-center text-blue-600"
							>
								<Icons.chat class="w-5 h-5 mr-2" />
								Language Requirements
							</h3>

							{#if $form.languageRequirements && $form.languageRequirements.length > 0}
								<div class="space-y-2 mb-3">
									{#each $form.languageRequirements as langReq, index}
										<div
											class="flex items-center justify-between p-2 border rounded-md bg-white"
										>
											<div>
												<span class="font-medium"
													>{langReq.name}</span
												>:
												<span class="text-gray-600"
													>{langReq.level}</span
												>
												{#if langReq.details}
													<p
														class="text-xs text-gray-500"
													>
														{langReq.details}
													</p>
												{/if}
											</div>
											<button
												type="button"
												class="text-red-500 hover:text-red-700"
												onclick={() => {
													$form.languageRequirements =
														$form.languageRequirements?.filter(
															(_, i) =>
																i !== index,
														);
												}}
											>
												<Icons.trash class="w-4 h-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}

							<div class="grid grid-cols-2 gap-2">
								<input
									type="text"
									placeholder="Language name (e.g., English)"
									class="px-3 py-2 border rounded-md"
									bind:value={newLanguageReq.name}
								/>
								<input
									type="text"
									placeholder="Level (e.g., B2, Fluent)"
									class="px-3 py-2 border rounded-md"
									bind:value={newLanguageReq.level}
								/>
								<input
									type="text"
									placeholder="Additional details (optional)"
									class="px-3 py-2 border rounded-md col-span-2"
									bind:value={newLanguageReq.details}
								/>
							</div>

							<button
								type="button"
								class="mt-2 flex items-center text-blue-600 hover:text-blue-800"
								onclick={addLanguageRequirement}
								disabled={!newLanguageReq.name ||
									!newLanguageReq.level}
							>
								<Icons.plus class="w-4 h-4 mr-1" />
								Add Language Requirement
							</button>
						</div>

						<div class="mb-4 p-4 bg-gray-50 border rounded-md">
							<h3
								class="text-md font-semibold mb-3 flex items-center text-green-600"
							>
								<Icons.fileText class="w-5 h-5 mr-2" />
								Test Requirements
							</h3>

							{#if $form.testRequirements && $form.testRequirements.length > 0}
								<div class="space-y-2 mb-3">
									{#each $form.testRequirements as testReq, index}
										<div
											class="flex items-center justify-between p-2 border rounded-md bg-white"
										>
											<div>
												<span class="font-medium"
													>{testReq.name}</span
												>:
												<span class="text-gray-600"
													>Min. score {testReq.score}</span
												>
												{#if testReq.details}
													<p
														class="text-xs text-gray-500"
													>
														{testReq.details}
													</p>
												{/if}
											</div>
											<button
												type="button"
												class="text-red-500 hover:text-red-700"
												onclick={() => {
													$form.testRequirements =
														$form.testRequirements?.filter(
															(_, i) =>
																i !== index,
														);
												}}
											>
												<Icons.trash class="w-4 h-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}

							<div class="grid grid-cols-2 gap-2">
								<input
									type="text"
									placeholder="Test name (e.g., TOEFL, GRE)"
									class="px-3 py-2 border rounded-md"
									bind:value={newTestReq.name}
								/>
								<input
									type="number"
									placeholder="Minimum score"
									class="px-3 py-2 border rounded-md"
									bind:value={newTestReq.score}
								/>
								<input
									type="text"
									placeholder="Additional details (optional)"
									class="px-3 py-2 border rounded-md col-span-2"
									bind:value={newTestReq.details}
								/>
							</div>

							<button
								type="button"
								class="mt-2 flex items-center text-green-600 hover:text-green-800"
								onclick={addTestRequirement}
								disabled={!newTestReq.name || !newTestReq.score}
							>
								<Icons.plus class="w-4 h-4 mr-1" />
								Add Test Requirement
							</button>
						</div>

						<div class="mb-4 p-4 bg-gray-50 border rounded-md">
							<h3
								class="text-md font-semibold mb-3 flex items-center text-purple-600"
							>
								<Icons.barChart class="w-5 h-5 mr-2" />
								Grade Requirements
							</h3>

							{#if $form.gradeRequirements && $form.gradeRequirements.length > 0}
								<div class="space-y-2 mb-3">
									{#each $form.gradeRequirements as gradeReq, index}
										<div
											class="flex items-center justify-between p-2 border rounded-md bg-white"
										>
											<div>
												<span class="font-medium"
													>{gradeReq.type}</span
												>:
												<span class="text-gray-600"
													>{gradeReq.value}</span
												>
												{#if gradeReq.details}
													<p
														class="text-xs text-gray-500"
													>
														{gradeReq.details}
													</p>
												{/if}
											</div>
											<button
												type="button"
												class="text-red-500 hover:text-red-700"
												onclick={() => {
													$form.gradeRequirements =
														$form.gradeRequirements?.filter(
															(_, i) =>
																i !== index,
														);
												}}
											>
												<Icons.trash class="w-4 h-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}

							<div class="grid grid-cols-2 gap-2">
								<input
									type="text"
									placeholder="Type (e.g., GPA, Class Rank)"
									class="px-3 py-2 border rounded-md"
									bind:value={newGradeReq.type}
								/>
								<input
									type="text"
									placeholder="Value (e.g., 3.5, Top 10%)"
									class="px-3 py-2 border rounded-md"
									bind:value={newGradeReq.value}
								/>
								<input
									type="text"
									placeholder="Additional details (optional)"
									class="px-3 py-2 border rounded-md col-span-2"
									bind:value={newGradeReq.details}
								/>
							</div>

							<button
								type="button"
								class="mt-2 flex items-center text-purple-600 hover:text-purple-800"
								onclick={addGradeRequirement}
								disabled={!newGradeReq.type ||
									!newGradeReq.value}
							>
								<Icons.plus class="w-4 h-4 mr-1" />
								Add Grade Requirement
							</button>
						</div>
					</Dropdown>
				</div>

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

	<!-- Activities Dashboard -->
	{#if activities.length === 0}
		<div
			class="flex flex-col items-center justify-center py-16 text-center"
			in:fade={{ duration: 300 }}
		>
			<Icons.calendar class="w-16 h-16 text-gray-300 mb-4" />
			<h3 class="text-xl font-semibold text-gray-700 mb-2">
				No activities found
			</h3>
			<p class="text-gray-500 max-w-md mb-6">
				{#if filterCategory !== "all" || filterMajor !== "all" || filterSearch || filterUserActivities}
					No activities match your current filters. Try adjusting your
					search criteria.
				{:else}
					Click the "Add Activity" button to create your first summer
					activity.
				{/if}
			</p>
			{#if filterCategory !== "all" || filterMajor !== "all" || filterSearch || filterUserActivities}
				<CrButton variant="outline" onclick={clearFilters}>
					<Icons.refresh class="w-4 h-4 mr-2" />
					Clear Filters
				</CrButton>
			{/if}
		</div>
	{:else}
		<!-- Grid Layout -->
		{#if layoutType === "grid"}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each activities as activity, i}
					<a
						href={`/activities/${activity.id}`}
						class="no-underline transition-transform hover:-translate-y-1 duration-300"
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
					>
						<div
							class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col"
						>
							<div
								class="h-24 relative bg-gradient-to-r
								{activity.category === 'internship'
									? 'from-blue-400 to-blue-600'
									: activity.category === 'course'
										? 'from-purple-400 to-purple-600'
										: activity.category === 'travel'
											? 'from-green-400 to-green-600'
											: activity.category ===
												  'volunteering'
												? 'from-amber-400 to-amber-600'
												: activity.category ===
													  'research'
													? 'from-indigo-400 to-indigo-600'
													: 'from-gray-400 to-gray-600'}"
							>
								<div
									class="absolute inset-0 opacity-30 pattern-grid"
								></div>

								<div
									class="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium shadow-sm flex items-center gap-1.5"
								>
									{#if activity.category === "internship"}
										<Icons.briefcase
											class="w-4 h-4 text-blue-600"
										/>
									{:else if activity.category === "course"}
										<Icons.book
											class="w-4 h-4 text-purple-600"
										/>
									{:else if activity.category === "travel"}
										<Icons.plane
											class="w-4 h-4 text-green-600"
										/>
									{:else if activity.category === "volunteering"}
										<Icons.heart
											class="w-4 h-4 text-amber-600"
										/>
									{:else if activity.category === "research"}
										<Icons.search
											class="w-4 h-4 text-indigo-600"
										/>
									{:else}
										<Icons.star
											class="w-4 h-4 text-gray-600"
										/>
									{/if}
									<span class="capitalize"
										>{activity.category}</span
									>
								</div>

								{#if activity.recommended}
									<div
										class="absolute top-3 right-4 px-2 py-1 bg-yellow-400 rounded-md text-xs font-bold"
									>
										{activity.recommended}/5
									</div>
								{/if}
							</div>

							<div class="p-5 flex-grow flex flex-col">
								<h3 class="text-lg font-bold mb-2 line-clamp-1">
									{activity.title}
								</h3>

								<div class="space-y-2 mb-3 text-sm">
									{#if activity.location}
										<div
											class="flex items-center text-gray-600"
										>
											<Icons.mapPin
												class="w-4 h-4 mr-2 flex-shrink-0"
											/>
											<span class="truncate"
												>{activity.location}</span
											>
										</div>
									{/if}

									<div
										class="flex items-center text-gray-600"
									>
										<Icons.clock
											class="w-4 h-4 mr-2 flex-shrink-0"
										/>
										<span>{activity.duration}</span>
									</div>

									{#if activity.major}
										<div
											class="flex items-center text-gray-600"
										>
											<Icons.graduationCap
												class="w-4 h-4 mr-2 flex-shrink-0"
											/>
											<span class="truncate"
												>{activity.major.title}</span
											>
										</div>
									{/if}
								</div>

								<p
									class="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow"
								>
									{activity.description}
								</p>

								{#if (activity.requirements && activity.requirements.length > 0) || (activity.languageRequirements && activity.languageRequirements.length > 0)}
									<div class="flex flex-wrap gap-2 mb-3">
										{#if activity.requirements && activity.requirements.length > 0}
											<span
												class="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center"
											>
												<Icons.check
													class="w-3 h-3 mr-1"
												/>
												{activity.requirements.length} Requirements
											</span>
										{/if}

										{#if activity.languageRequirements && activity.languageRequirements.length > 0}
											<span
												class="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs flex items-center"
											>
												<Icons.chat
													class="w-3 h-3 mr-1"
												/>
												{activity.languageRequirements
													.length} Languages
											</span>
										{/if}
									</div>
								{/if}

								<div
									class="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between"
								>
									{#if activity.link}
										<a
											href={activity.link}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
											onclick={(e) => e.stopPropagation()}
										>
											<Icons.externalLink
												class="w-4 h-4 mr-1"
											/>
											Website
										</a>
									{:else}
										<span></span>
									{/if}

									<span
										class="text-sm text-gray-500 flex items-center"
									>
										<Icons.info class="w-4 h-4 mr-1" />
										View Details
									</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- List Layout -->
		{:else if layoutType === "list"}
			<div class="space-y-4">
				{#each activities as activity, i}
					<a
						href={`/activities/${activity.id}`}
						class="no-underline block"
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 30 }}
					>
						<div
							class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:translate-x-1 duration-300 border border-gray-200/50 dark:border-gray-700/50"
						>
							<div class="flex flex-col md:flex-row">
								<div class="md:w-3/12 lg:w-2/12">
									<div
										class="h-full relative bg-gradient-to-r
										{activity.category === 'internship'
											? 'from-blue-400 to-blue-600'
											: activity.category === 'course'
												? 'from-purple-400 to-purple-600'
												: activity.category === 'travel'
													? 'from-green-400 to-green-600'
													: activity.category ===
														  'volunteering'
														? 'from-amber-400 to-amber-600'
														: activity.category ===
															  'research'
															? 'from-indigo-400 to-indigo-600'
															: 'from-gray-400 to-gray-600'}"
									>
										<div
											class="absolute inset-0 opacity-30 pattern-grid"
										></div>
										<div
											class="flex items-center justify-center h-full p-4"
										>
											{#if activity.category === "internship"}
												<Icons.briefcase
													class="w-12 h-12 text-white"
												/>
											{:else if activity.category === "course"}
												<Icons.book
													class="w-12 h-12 text-white"
												/>
											{:else if activity.category === "travel"}
												<Icons.plane
													class="w-12 h-12 text-white"
												/>
											{:else if activity.category === "volunteering"}
												<Icons.heart
													class="w-12 h-12 text-white"
												/>
											{:else if activity.category === "research"}
												<Icons.search
													class="w-12 h-12 text-white"
												/>
											{:else}
												<Icons.star
													class="w-12 h-12 text-white"
												/>
											{/if}
										</div>
									</div>
								</div>

								<div class="p-5 md:w-9/12 lg:w-10/12">
									<div
										class="flex items-center justify-between mb-2"
									>
										<div class="flex items-center">
											<h3 class="text-lg font-bold mr-3">
												{activity.title}
											</h3>
											<span
												class="capitalize px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700"
											>
												{activity.category}
											</span>
										</div>

										{#if activity.recommended}
											<div class="flex items-center">
												<Icons.star
													class="w-4 h-4 text-yellow-500 mr-1"
												/>
												<span class="text-sm font-bold"
													>{activity.recommended}/5</span
												>
											</div>
										{/if}
									</div>

									<p
										class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3"
									>
										{activity.description}
									</p>

									<div
										class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
									>
										{#if activity.location}
											<div class="flex items-center">
												<Icons.mapPin
													class="w-4 h-4 mr-1 flex-shrink-0 text-gray-500"
												/>
												<span>{activity.location}</span>
											</div>
										{/if}

										<div class="flex items-center">
											<Icons.clock
												class="w-4 h-4 mr-1 flex-shrink-0 text-gray-500"
											/>
											<span>{activity.duration}</span>
										</div>

										{#if activity.major}
											<div class="flex items-center">
												<Icons.graduationCap
													class="w-4 h-4 mr-1 flex-shrink-0 text-gray-500"
												/>
												<span
													>{activity.major
														.title}</span
												>
											</div>
										{/if}

										{#if activity.requirements && activity.requirements.length > 0}
											<div class="flex items-center">
												<Icons.check
													class="w-4 h-4 mr-1 flex-shrink-0 text-blue-500"
												/>
												<span class="text-blue-600"
													>{activity.requirements
														.length} Requirements</span
												>
											</div>
										{/if}

										{#if activity.languageRequirements && activity.languageRequirements.length > 0}
											<div class="flex items-center">
												<Icons.chat
													class="w-4 h-4 mr-1 flex-shrink-0 text-green-500"
												/>
												<span class="text-green-600"
													>{activity
														.languageRequirements
														.length} Languages</span
												>
											</div>
										{/if}

										{#if activity.link}
											<a
												href={activity.link}
												target="_blank"
												rel="noopener noreferrer"
												class="flex items-center text-blue-600 hover:text-blue-800 ml-auto"
												onclick={(e) =>
													e.stopPropagation()}
											>
												<Icons.externalLink
													class="w-4 h-4 mr-1"
												/>
												<span>Website</span>
											</a>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Cards Layout -->
		{:else if layoutType === "cards"}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each activities as activity, i}
					<a
						href={`/activities/${activity.id}`}
						class="no-underline"
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
					>
						<div
							class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-300 border border-gray-200/50 dark:border-gray-700/50 h-full"
						>
							<div class="p-6">
								<div
									class="flex items-start justify-between mb-4"
								>
									<div class="flex items-center">
										<div
											class="p-2 rounded-lg mr-4
											{activity.category === 'internship'
												? 'bg-blue-100 text-blue-600'
												: activity.category === 'course'
													? 'bg-purple-100 text-purple-600'
													: activity.category ===
														  'travel'
														? 'bg-green-100 text-green-600'
														: activity.category ===
															  'volunteering'
															? 'bg-amber-100 text-amber-600'
															: activity.category ===
																  'research'
																? 'bg-indigo-100 text-indigo-600'
																: 'bg-gray-100 text-gray-600'}"
										>
											{#if activity.category === "internship"}
												<Icons.briefcase
													class="w-6 h-6"
												/>
											{:else if activity.category === "course"}
												<Icons.book class="w-6 h-6" />
											{:else if activity.category === "travel"}
												<Icons.plane class="w-6 h-6" />
											{:else if activity.category === "volunteering"}
												<Icons.heart class="w-6 h-6" />
											{:else if activity.category === "research"}
												<Icons.search class="w-6 h-6" />
											{:else}
												<Icons.star class="w-6 h-6" />
											{/if}
										</div>
										<div>
											<h3 class="text-xl font-bold">
												{activity.title}
											</h3>
											<p
												class="text-sm text-gray-500 capitalize"
											>
												{activity.category}
											</p>
										</div>
									</div>

									{#if activity.recommended}
										<div
											class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center"
										>
											<Icons.star
												class="w-4 h-4 mr-1 text-yellow-500"
											/>
											{activity.recommended}/5
										</div>
									{/if}
								</div>

								<p
									class="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3"
								>
									{activity.description}
								</p>

								<div
									class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-3"
								>
									<div class="flex flex-wrap gap-4 text-sm">
										{#if activity.location}
											<div class="flex items-center">
												<Icons.mapPin
													class="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-500"
												/>
												<span
													class="text-gray-700 dark:text-gray-300"
													>{activity.location}</span
												>
											</div>
										{/if}

										<div class="flex items-center">
											<Icons.clock
												class="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-500"
											/>
											<span
												class="text-gray-700 dark:text-gray-300"
												>{activity.duration}</span
											>
										</div>
									</div>

									{#if activity.major}
										<div class="flex items-center text-sm">
											<Icons.graduationCap
												class="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-500"
											/>
											<span
												class="text-gray-700 dark:text-gray-300"
												>{activity.major.title}</span
											>
										</div>
									{/if}

									{#if (activity.requirements && activity.requirements.length > 0) || (activity.languageRequirements && activity.languageRequirements.length > 0)}
										<div class="flex flex-wrap gap-2">
											{#if activity.requirements && activity.requirements.length > 0}
												<span
													class="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center"
												>
													<Icons.check
														class="w-3 h-3 mr-1"
													/>
													{activity.requirements
														.length} Requirements
												</span>
											{/if}

											{#if activity.languageRequirements && activity.languageRequirements.length > 0}
												<span
													class="px-2.5 py-1 bg-green-100 text-green-800 rounded-md text-xs flex items-center"
												>
													<Icons.chat
														class="w-3 h-3 mr-1"
													/>
													{activity
														.languageRequirements
														.length} Languages
												</span>
											{/if}
										</div>
									{/if}
								</div>

								<div
									class="mt-5 flex justify-between items-center"
								>
									<span
										class="text-sm text-gray-500 flex items-center"
									>
										<Icons.info class="w-4 h-4 mr-1" />
										View Details
									</span>

									{#if activity.link}
										<a
											href={activity.link}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
											onclick={(e) => e.stopPropagation()}
										>
											<Icons.externalLink
												class="w-4 h-4 mr-1.5"
											/>
											Website
										</a>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Book Layout -->
		{:else if layoutType === "book"}
			<div class="space-y-10">
				{#each activities as activity, i}
					<a
						href={`/activities/${activity.id}`}
						class="no-underline block"
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
					>
						<div
							class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200/50 dark:border-gray-700/50"
						>
							<div class="p-8">
								<div class="flex items-center mb-5">
									<div
										class="mr-4 p-2 rounded-full
										{activity.category === 'internship'
											? 'bg-blue-100 text-blue-600'
											: activity.category === 'course'
												? 'bg-purple-100 text-purple-600'
												: activity.category === 'travel'
													? 'bg-green-100 text-green-600'
													: activity.category ===
														  'volunteering'
														? 'bg-amber-100 text-amber-600'
														: activity.category ===
															  'research'
															? 'bg-indigo-100 text-indigo-600'
															: 'bg-gray-100 text-gray-600'}"
									>
										{#if activity.category === "internship"}
											<Icons.briefcase class="w-8 h-8" />
										{:else if activity.category === "course"}
											<Icons.book class="w-8 h-8" />
										{:else if activity.category === "travel"}
											<Icons.plane class="w-8 h-8" />
										{:else if activity.category === "volunteering"}
											<Icons.heart class="w-8 h-8" />
										{:else if activity.category === "research"}
											<Icons.search class="w-8 h-8" />
										{:else}
											<Icons.star class="w-8 h-8" />
										{/if}
									</div>
									<div>
										<h3 class="text-2xl font-bold">
											{activity.title}
										</h3>
										<p class="text-gray-500 capitalize">
											{activity.category}
										</p>
									</div>

									{#if activity.recommended}
										<div
											class="ml-auto bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center"
										>
											<Icons.star
												class="w-5 h-5 mr-1.5 text-yellow-500"
											/>
											{activity.recommended}/5
										</div>
									{/if}
								</div>

								<p
									class="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed"
								>
									{activity.description}
								</p>

								<div
									class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
								>
									<div
										class="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
									>
										<h4
											class="text-sm uppercase tracking-wider text-gray-500 mb-2 font-bold"
										>
											Location
										</h4>
										<div
											class="flex items-center text-gray-700 dark:text-gray-300"
										>
											<Icons.mapPin
												class="w-5 h-5 mr-2 flex-shrink-0 text-gray-500"
											/>
											<span class="text-lg"
												>{activity.location ||
													"Not specified"}</span
											>
										</div>
									</div>

									<div
										class="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
									>
										<h4
											class="text-sm uppercase tracking-wider text-gray-500 mb-2 font-bold"
										>
											Duration
										</h4>
										<div
											class="flex items-center text-gray-700 dark:text-gray-300"
										>
											<Icons.clock
												class="w-5 h-5 mr-2 flex-shrink-0 text-gray-500"
											/>
											<span class="text-lg"
												>{activity.duration}</span
											>
										</div>
									</div>

									<div
										class="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
									>
										<h4
											class="text-sm uppercase tracking-wider text-gray-500 mb-2 font-bold"
										>
											Major
										</h4>
										<div
											class="flex items-center text-gray-700 dark:text-gray-300"
										>
											<Icons.graduationCap
												class="w-5 h-5 mr-2 flex-shrink-0 text-gray-500"
											/>
											<span class="text-lg"
												>{activity.major?.title ||
													"Any major"}</span
											>
										</div>
									</div>
								</div>

								<div class="flex flex-wrap gap-3 mb-6">
									{#if activity.requirements && activity.requirements.length > 0}
										<span
											class="px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center"
										>
											<Icons.check
												class="w-4 h-4 mr-1.5"
											/>
											{activity.requirements.length} Requirements
										</span>
									{/if}

									{#if activity.languageRequirements && activity.languageRequirements.length > 0}
										<span
											class="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm flex items-center"
										>
											<Icons.chat
												class="w-4 h-4 mr-1.5"
											/>
											{activity.languageRequirements
												.length} Language Requirements
										</span>
									{/if}

									{#if activity.testRequirements && activity.testRequirements.length > 0}
										<span
											class="px-4 py-2 bg-purple-100 text-purple-800 rounded-md text-sm flex items-center"
										>
											<Icons.fileText
												class="w-4 h-4 mr-1.5"
											/>
											{activity.testRequirements.length} Test
											Requirements
										</span>
									{/if}
								</div>

								<div
									class="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
								>
									<div
										class="flex items-center text-gray-600 dark:text-gray-400"
									>
										<Icons.calendar class="w-5 h-5 mr-2" />
										<span
											>Year: {activity.year ||
												"Not specified"}</span
										>
									</div>

									<div class="flex items-center">
										<span
											class="text-gray-600 dark:text-gray-400 flex items-center mr-4"
										>
											<Icons.info class="w-5 h-5 mr-2" />
											View Details
										</span>

										{#if activity.link}
											<a
												href={activity.link}
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
												onclick={(e) =>
													e.stopPropagation()}
											>
												<Icons.externalLink
													class="w-4 h-4 mr-2"
												/>
												Visit Website
											</a>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	/* Hide scrollbar but maintain functionality */
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	/* Pattern grid for cards */
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
</style>
