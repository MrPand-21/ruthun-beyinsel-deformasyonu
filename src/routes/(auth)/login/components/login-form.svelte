<script lang="ts">
	import { onMount } from "svelte";
	import {
		type Infer,
		superForm,
		type SuperValidated,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Button, Label, Switch } from "bits-ui";
	import { PUBLIC_LANDING_PAGE } from "$env/static/public";
	import { getEmptyErrorResponse } from "$lib/services/error.service";
	import { getSiteAnalytics } from "$lib/services/analytics.service";
	import {
		deleteLastLoginEmail,
		getLastLoginEmail,
		saveLastLoginEmail,
	} from "../helpers";
	import { type FormSchema, formSchema } from "../schema";
	import type { AnalyticsDto, ErrorResponseType } from "$lib/types";
	import { Icons } from "$lib/components/icons";
	import { signIn } from "@auth/sveltekit/client";
	import { page } from "$app/stores";

	export let data: SuperValidated<Infer<FormSchema>>;

	let isLoadingFormSubmit = false;
	let isLoadingGoogleAuth = false;
	let errorResponse: ErrorResponseType | null = null;
	let rememberEmail = false;

	let analytics: AnalyticsDto = {
		browserHash: "",
		landingPage: PUBLIC_LANDING_PAGE,
		isIncognitoMode: false,
		userAgent: "",
		referralSiteUrl: "",
	};

	const form = superForm(data, {
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
		onResult: async ({ result }) => {
			if (result.type !== "success" || !result.data) {
				isLoadingFormSubmit = false;
				if (result.data?.error) {
					errorResponse = getEmptyErrorResponse(result.data.error);
				}
				return;
			}

			const formData = result.data.form;
			if (!formData.valid) {
				isLoadingFormSubmit = false;
				return;
			}

			performRememberMe();
			isLoadingFormSubmit = false;
		},
	});

	const { form: formData, enhance } = form;

	$: {
		$formData.browserHash = analytics.browserHash;
		$formData.userAgent = analytics.userAgent;
	}

	onMount(async () => {
		const lastLoginEmail = getLastLoginEmail();

		if (lastLoginEmail) {
			$formData.email = lastLoginEmail;
			rememberEmail = true;
		}

		if (navigator) {
			analytics = await getSiteAnalytics();
		}
	});

	function performRememberMe() {
		if (rememberEmail) {
			saveLastLoginEmail($formData.email);
			return;
		}
		deleteLastLoginEmail();
	}

	async function handleGoogleSignIn() {
		isLoadingGoogleAuth = true;
		try {
			await signIn("google", {
				callbackUrl: $page.url.searchParams.get("callbackUrl") || "/",
			});
		} catch (error) {
			console.error("Google sign in error:", error);
			errorResponse = getEmptyErrorResponse(
				"Google sign in failed. Please try again.",
			);
			isLoadingGoogleAuth = false;
		}
	}
</script>

<div>
	<h1 class="mx-auto text-center text-2xl font-bold">Sign In</h1>
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
				/>
				{#if form.errors?.email}
					<p class="text-sm text-destructive">{form.errors.email}</p>
				{/if}
			</div>

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
				{#if form.errors?.password}
					<p class="text-sm text-destructive">
						{form.errors.password}
					</p>
				{/if}
			</div>

			<div class="flex items-center space-x-4">
				<Switch.Root id="remember-me" bind:checked={rememberEmail} />
				<Label.Root for="remember-me">Remember my email</Label.Root>
			</div>

			{#if errorResponse && errorResponse.message}
				<p class="text-sm text-destructive">{errorResponse.message}</p>
			{/if}

			<Button.Root disabled={isLoadingFormSubmit} class="w-full">
				{#if isLoadingFormSubmit}
					<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Sign In
			</Button.Root>
		</form>

		<div class="relative mt-5">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t"></span>
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 text-muted-foreground">
					Or continue with
				</span>
			</div>
		</div>

		<Button.Root
			type="button"
			disabled={isLoadingGoogleAuth || isLoadingFormSubmit}
			class="hover:bg-gray-50 hover:text-black"
			on:click={handleGoogleSignIn}
		>
			{#if isLoadingGoogleAuth}
				<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<Icons.google class="mr-2 h-4 w-4" />
			{/if}
			Google
		</Button.Root>

		<div class="text-center">
			<Button.Root href="/forgot-password">Forgot Password?</Button.Root>
		</div>
	</div>
</div>
