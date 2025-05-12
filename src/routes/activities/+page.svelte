<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import ComponentCard from "$lib/components/ui/ComponentCard.svelte";
	import { DateRangePicker, type DateRange, Select } from "bits-ui";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Check from "phosphor-svelte/lib/Check";
	import Palette from "phosphor-svelte/lib/Palette";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
	import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
	import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
	import type {
		Activity,
		ActivityDocument,
	} from "$lib/server/db/models/activity.model.js";
	import { superForm } from "sveltekit-superforms/client";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { formSchema } from "./schema";

	let { data } = $props();

	let activities = $state<Activity[]>(data.activities);
	let isAddingActivity = $state(false);

	let dateRange = $state({
		from: new Date(),
		to: new Date(),
	});

	let newActivity = $state({
		title: "",
		description: "",
		location: "",
		startDate: new Date().toISOString().split("T")[0],
		endDate: new Date().toISOString().split("T")[0],
		category: "other",
		tags: "",
	});

	const formData = superForm(data.form, {
		taintedMessage: false, // Disable unsaved changes warning
		resetForm: true,
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

	$effect(() => {
		if (dateRange.from) {
			newActivity.startDate = dateRange.from.toISOString().split("T")[0];
		}
		if (dateRange.to) {
			newActivity.endDate = dateRange.to.toISOString().split("T")[0];
		}
	});

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

	async function handleSubmit() {
		console.log("Submitting form...");
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

					<!-- Category Select -->
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
							value={categoryValue}
						>
							<Select.Trigger
								class="h-input rounded-9px border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-full select-none items-center border px-[11px] text-sm transition-colors"
								aria-label="Select a category"
							>
								<Palette
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
				</div>

				<div>
					<DateRangePicker.Root
						bind:value={dateRange}
						weekdayFormat="short"
						fixedWeeks={true}
						class="flex w-full flex-col gap-1.5"
					>
						<DateRangePicker.Label
							class="block select-none text-sm font-medium text-gray-700"
							>Activity Period *</DateRangePicker.Label
						>
						<div
							class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
						>
							{#each ["start", "end"] as const as type}
								<DateRangePicker.Input {type}>
									{#snippet children({ segments })}
										{#each segments as { part, value }}
											<div
												class="inline-block select-none"
											>
												{#if part === "literal"}
													<DateRangePicker.Segment
														{part}
														class="text-muted-foreground p-1"
													>
														{value}
													</DateRangePicker.Segment>
												{:else}
													<DateRangePicker.Segment
														{part}
														class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
													>
														{value}
													</DateRangePicker.Segment>
												{/if}
											</div>
										{/each}
									{/snippet}
								</DateRangePicker.Input>
								{#if type === "start"}
									<div
										aria-hidden="true"
										class="text-muted-foreground px-1"
									>
										–⁠⁠⁠⁠⁠
									</div>
								{/if}
							{/each}

							<DateRangePicker.Trigger
								class="text-foreground/60 hover:bg-muted active:bg-dark-10 ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
							>
								<CalendarBlank class="size-6" />
							</DateRangePicker.Trigger>
						</div>
						<DateRangePicker.Content sideOffset={6} class="z-50">
							<DateRangePicker.Calendar
								class="rounded-15px border-dark-10 bg-background-alt shadow-popover mt-6 border p-[22px]"
							>
								{#snippet children({ months, weekdays })}
									<DateRangePicker.Header
										class="flex items-center justify-between"
									>
										<DateRangePicker.PrevButton
											class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
										>
											<CaretLeft class="size-6" />
										</DateRangePicker.PrevButton>
										<DateRangePicker.Heading
											class="text-[15px] font-medium"
										/>
										<DateRangePicker.NextButton
											class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
										>
											<CaretRight class="size-6" />
										</DateRangePicker.NextButton>
									</DateRangePicker.Header>
									<div
										class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
									>
										{#each months as month}
											<DateRangePicker.Grid
												class="w-full border-collapse select-none space-y-1"
											>
												<DateRangePicker.GridHead>
													<DateRangePicker.GridRow
														class="mb-1 flex w-full justify-between"
													>
														{#each weekdays as day}
															<DateRangePicker.HeadCell
																class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
															>
																<div>
																	{day.slice(
																		0,
																		2,
																	)}
																</div>
															</DateRangePicker.HeadCell>
														{/each}
													</DateRangePicker.GridRow>
												</DateRangePicker.GridHead>
												<DateRangePicker.GridBody>
													{#each month.weeks as weekDates}
														<DateRangePicker.GridRow
															class="flex w-full"
														>
															{#each weekDates as date}
																<DateRangePicker.Cell
																	{date}
																	month={month.value}
																	class="p-0! relative m-0 size-10 overflow-visible text-center text-sm focus-within:relative focus-within:z-20"
																>
																	<DateRangePicker.Day
																		class={"rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none  data-highlighted:rounded-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-unavailable:line-through data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"}
																	>
																		<div
																			class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
																		></div>
																		{date.day}
																	</DateRangePicker.Day>
																</DateRangePicker.Cell>
															{/each}
														</DateRangePicker.GridRow>
													{/each}
												</DateRangePicker.GridBody>
											</DateRangePicker.Grid>
										{/each}
									</div>
								{/snippet}
							</DateRangePicker.Calendar>
						</DateRangePicker.Content>
					</DateRangePicker.Root>
					{#if $errors.startDate || $errors.endDate}
						<p class="mt-1 text-sm text-red-600">
							{$errors.startDate || $errors.endDate}
						</p>
					{/if}
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
