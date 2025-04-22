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
</script>

<Seo
	title="Register"
	description="Create a new account"
	keywords="register, sign up, create account"
/>

<main class="relative p-5 py-6 sm:px-8">
	<div class="mx-auto my-12 grid max-w-5xl place-items-center">
		<div>
			<h1 class="mx-auto text-center text-2xl font-bold">
				Create an Account
			</h1>
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
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

					<Button.Root disabled={isLoadingFormSubmit} class="w-full">
						{#if isLoadingFormSubmit}
							<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Register
					</Button.Root>
				</form>

				<div class="text-center">
					<p class="text-sm text-gray-500">
						Already have an account?
						<Button.Root href="/login" class="p-0"
							>Sign In</Button.Root
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</main>
