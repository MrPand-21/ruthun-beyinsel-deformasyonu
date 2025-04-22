<script lang="ts">
	import { onMount } from "svelte";
	import {
		type Infer,
		superForm,
		type SuperValidated,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Button } from "bits-ui";
	import { PUBLIC_LANDING_PAGE } from "$env/static/public";
	import { getEmptyErrorResponse } from "$lib/services/error.service";
	import { getSiteAnalytics } from "$lib/services/analytics.service";
	import { type FormSchema, formSchema } from "./schema";
	import type { AnalyticsDto, ErrorResponseType } from "$lib/types";
	import { Icons } from "$lib/components/icons";
	import Seo from "$lib/components/SEO.svelte";
	import Google from "$lib/components/icons/google.svelte";

	export let data;

	let isLoadingFormSubmit = false;
	let errorResponse: ErrorResponseType | null = null;

	let analytics: AnalyticsDto = {
		browserHash: "",
		landingPage: PUBLIC_LANDING_PAGE,
		isIncognitoMode: false,
		userAgent: "",
		referralSiteUrl: "",
	};

	const form = superForm(data.form, {
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
				return;
			}

			// Registration was successful - redirection is handled by the server
		},
	});

	const { form: formData, enhance, errors } = form;

	$: {
		$formData.browserHash = analytics.browserHash;
		$formData.userAgent = analytics.userAgent;
	}

	onMount(async () => {
		if (navigator) {
			analytics = await getSiteAnalytics();
		}
	});

	const handleGoogleSignIn = () => {
		window.location.href = "/api/auth/google";
	};
</script>

<Seo
	title="Register"
	description="Create a new account"
	keywords="register, sign up, create account"
/>

<main class="relative p-5 py-6 sm:px-8">
	<div class="mx-auto my-6 grid max-w-md place-items-center">
		<div
			class="w-full rounded-xl bg-card p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
		>
			<h1
				class="mx-auto mb-5 text-center text-2xl font-bold text-primary"
			>
				Create an Account
			</h1>

			<!-- Google Sign Up Button -->
			<div class="mb-6">
				<button
					on:click={handleGoogleSignIn}
					class="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					<Google class="h-5 w-5" />
					<span>Sign up with Google</span>
				</button>
			</div>

			<!-- Divider -->
			<div class="relative mb-6 flex items-center">
				<div class="flex-grow border-t border-gray-300"></div>
				<span class="mx-4 flex-shrink text-xs text-gray-500"
					>OR CONTINUE WITH EMAIL</span
				>
				<div class="flex-grow border-t border-gray-300"></div>
			</div>

			<div class="w-full">
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

					<!-- Name -->
					<div class="space-y-2">
						<label
							for="name"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Full Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							bind:value={$formData.name}
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="John Doe"
						/>
						{#if $errors.name}
							<p class="text-sm text-destructive">
								{$errors.name}
							</p>
						{/if}
					</div>

					<!-- Email -->
					<div class="space-y-2">
						<label
							for="email"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							bind:value={$formData.email}
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="you@example.com"
						/>
						{#if $errors.email}
							<p class="text-sm text-destructive">
								{$errors.email}
							</p>
						{/if}
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label
							for="password"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							bind:value={$formData.password}
							placeholder="********"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if $errors.password}
							<p class="text-sm text-destructive">
								{$errors.password}
							</p>
						{/if}
					</div>

					<!-- Confirm Password -->
					<div class="space-y-2">
						<label
							for="confirmPassword"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							bind:value={$formData.confirmPassword}
							placeholder="********"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{#if $errors.confirmPassword}
							<p class="text-sm text-destructive">
								{$errors.confirmPassword}
							</p>
						{/if}
					</div>

					{#if errorResponse && errorResponse.message}
						<p class="text-sm text-destructive">
							{errorResponse.message}
						</p>
					{/if}

					<Button.Root
						disabled={isLoadingFormSubmit}
						class="w-full bg-primary text-primary-foreground hover:bg-primary/90"
					>
						{#if isLoadingFormSubmit}
							<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Create Account
					</Button.Root>
				</form>

				<div class="mt-6 text-center">
					<p class="text-sm text-gray-500">
						Already have an account?
						<Button.Root
							href="/login"
							class="p-0 text-primary font-medium hover:underline"
							>Sign In</Button.Root
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	/* Add some nice animations and transitions */
	input,
	button {
		transition: all 0.2s ease;
	}

	input:focus {
		transform: translateY(-1px);
	}

	button:active:not(:disabled) {
		transform: translateY(1px);
	}
</style>
