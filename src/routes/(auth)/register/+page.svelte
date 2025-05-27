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
	import { CrInput } from "$lib/components/ui/input";
	import CrButton from "$lib/components/ui/button/CrButton.svelte";
	import { toast } from "svelte-sonner";

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
		onSubmit: ({ formData }) => {
			errorResponse = null;
			isLoadingFormSubmit = true;
		},
		onError: () => {
			isLoadingFormSubmit = false;
			errorResponse = getEmptyErrorResponse(
				"Something went wrong. Please try again.",
			);
			toast.error("Something went wrong. Please try again.");
		},
		onResult: ({ result }) => {
			if (result.type !== "success" || !result.data) {
				isLoadingFormSubmit = false;
				return;
			}

			if (result.data.message) {
				isLoadingFormSubmit = false;
				toast.error(result.data.message);
				return;
			}

			const formData = result.data.form;
			if (!formData.valid) {
				isLoadingFormSubmit = false;
				return;
			}
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

<main
	class="relative p-5 py-6 sm:px-8 mx-auto my-12 grid max-w-5xl place-items-center"
>
	<div class="mt-4 grid min-w-[19rem] max-w-md gap-2">
		<!-- <div class="mb-6">
			<button
				on:click={handleGoogleSignIn}
				class="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
			>
				<Google class="h-5 w-5" />
				<span>Sign up with Google</span>
			</button>
		</div>

		<div class="relative mb-6 flex items-center">
			<div class="flex-grow border-t border-gray-300"></div>
			<span class="mx-4 flex-shrink text-xs text-gray-500"
				>OR CONTINUE WITH EMAIL</span
			>
			<div class="flex-grow border-t border-gray-300"></div>
		</div> -->

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

				<CrInput
					label="Full Name"
					name="username"
					bind:value={$formData.username}
					placeholder="John Doe"
					error={$errors.username}
					required
				/>

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

				<CrInput
					label="Confirm Password"
					name="confirmPassword"
					type="password"
					bind:value={$formData.confirmPassword}
					placeholder="********"
					error={$errors.confirmPassword}
					required
				/>

				{#if errorResponse && errorResponse.message}
					<p class="text-sm text-amber-500">
						{errorResponse.message}
					</p>
				{/if}

				<CrButton variant="primary" disabled={isLoadingFormSubmit}>
					{#if isLoadingFormSubmit}
						<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Create Account
				</CrButton>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-gray-500">
					Already have an account?
					<Button.Root
						href="/login"
						class="p-0 text-sky-600 font-medium hover:underline"
						>Sign In</Button.Root
					>
				</p>
			</div>
		</div>
	</div>
</main>

<style>
	button:active:not(:disabled) {
		transform: translateY(1px);
	}
</style>
