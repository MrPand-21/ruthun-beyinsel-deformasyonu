<script lang="ts">
	import { onMount } from "svelte";
	import { superForm } from "sveltekit-superforms/client";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Button } from "bits-ui";
	import { PUBLIC_LANDING_PAGE } from "$env/static/public";
	import { getEmptyErrorResponse } from "$lib/services/error.service";
	import { getSiteAnalytics } from "$lib/services/analytics.service";
	import { formSchema } from "./schema";
	import type { AnalyticsDto, ErrorResponseType } from "$lib/types";
	import { Icons } from "$lib/components/icons";
	import Google from "$lib/components/icons/google.svelte";
	import { CrInput } from "$lib/components/ui/input";
	import CrButton from "$lib/components/ui/button/CrButton.svelte";
	import { goto } from "$app/navigation";

	let { data: formProps, source, googleAuthURL } = $props();

	let isLoadingFormSubmit = $state(false);
	let errorResponse: ErrorResponseType | null = $state(null);

	let analytics: AnalyticsDto = {
		browserHash: "",
		landingPage: PUBLIC_LANDING_PAGE,
		isIncognitoMode: false,
		userAgent: "",
		referralSiteUrl: "",
	};

	const form = superForm(formProps, {
		validators: zodClient(formSchema),
		onSubmit: () => {
			errorResponse = null;
			isLoadingFormSubmit = true;
		},
		onError: () => {
			isLoadingFormSubmit = false;
			errorResponse = getEmptyErrorResponse(
				"Something went wrong. Please try again.",
			);
		},
		onResult: ({ result }) => {
			if (result.type !== "success" || !result.data) {
				isLoadingFormSubmit = false;
				return;
			}

			const formData = result.data.form;
			if (!formData.valid) {
				isLoadingFormSubmit = false;
				errorResponse = { message: "Invalid credentials" };
				return;
			}

			// Handle successful login
			if (result.data.message) {
				errorResponse = { message: result.data.message };
				isLoadingFormSubmit = false;
			} else {
				goto(source || "/");
			}
		},
	});

	const { form: formData, enhance, errors, reset } = form;

	$effect(() => {
		$formData.browserHash = analytics.browserHash;
		$formData.userAgent = analytics.userAgent;
	});

	onMount(async () => {
		if (navigator) {
			analytics = await getSiteAnalytics();
		}
	});

	const handleGoogleSignIn = () => {
		window.location.href = googleAuthURL;
	};
</script>

<div class="mt-4 grid min-w-[19rem] max-w-md gap-6">
	<form method="POST" use:enhance class="space-y-4">
		<input
			type="hidden"
			name="browserHash"
			bind:value={$formData.browserHash}
		/>
		<input
			type="hidden"
			name="userAgent"
			bind:value={$formData.userAgent}
		/>
		<input type="hidden" name="source" value={source || "/"} />

		<CrInput
			label="Email Address"
			name="email"
			type="email"
			bind:value={$formData.email}
			placeholder="you@example.com"
			error={$errors.email}
			required
		/>

		<CrInput
			label="Password"
			name="password"
			type="password"
			bind:value={$formData.password}
			placeholder="********"
			error={$errors.password}
			required
		/>

		<div class="flex justify-between items-center">
			<label
				for="remember"
				class="inline-flex items-center cursor-pointer"
			>
				<input
					id="remember"
					type="checkbox"
					name="remember"
					bind:checked={$formData.remember}
					class="h-4 w-4 border border-gray-300 rounded bg-gray-100 focus:ring-3 focus:ring-primary transition duration-200"
				/>
				<span class="ml-2 text-sm text-gray-600">Remember me</span>
			</label>
			<a
				href="/forgot-password"
				class="text-sm font-medium text-primary hover:underline"
			>
				Forgot password?
			</a>
		</div>

		{#if errorResponse && errorResponse.message}
			<div
				class="p-4 mb-4 text-sm text-destructive rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
			>
				{errorResponse.message}
			</div>
		{/if}

		<CrButton type="submit" disabled={isLoadingFormSubmit}>
			{#if isLoadingFormSubmit}
				<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Sign in
		</CrButton>
	</form>

	<div class="relative flex items-center">
		<div class="flex-grow border-t border-gray-300"></div>
		<span class="mx-4 flex-shrink text-xs text-gray-500"
			>OR CONTINUE WITH</span
		>
		<div class="flex-grow border-t border-gray-300"></div>
	</div>

	<button
		on:click={handleGoogleSignIn}
		class="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
	>
		<Google class="h-5 w-5" />
		<span>Sign in with Google</span>
	</button>

	<div class="text-center">
		<p class="text-sm text-gray-500">
			Don't have an account?
			<Button.Root
				href="/register"
				class="p-0 text-primary font-medium hover:underline"
				>Create an account</Button.Root
			>
		</p>
	</div>
</div>
