<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import AnimatedButton from "$lib/components/AnimatedButton.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import { SignIn, SignOut } from "@auth/sveltekit/components";
	import { page } from "$app/stores";
</script>

<Seo
	title="RC Community Hub"
	description="Connect with Robert College community - Share experiences, discuss courses, and explore club activities"
	keywords="robert college, rc community, summer activities, courses, clubs, student experiences"
/>

<main class="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8">
	<Hero />

	<div class="auth-section py-4 my-6 flex flex-col items-center">
		<h2 class="text-xl font-semibold mb-4">SvelteKit Auth Example</h2>
		<div
			class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
		>
			{#if $page.data.session}
				<div class="flex items-center gap-4 mb-6">
					{#if $page.data.session.user?.image}
						<img
							src={$page.data.session.user.image}
							class="w-12 h-12 rounded-full"
							alt="User Avatar"
						/>
					{/if}
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">
							<small>Signed in as</small>
						</span>
						<div class="font-medium">
							{$page.data.session.user?.name ?? "User"}
						</div>
					</div>
				</div>
				<SignOut>
					<div
						slot="submitButton"
						class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full text-center"
					>
						Sign out
					</div>
				</SignOut>
			{:else}
				<span
					class="block text-center mb-4 text-gray-600 dark:text-gray-300"
					>You are not signed in</span
				>
				<div class="space-y-4">
					<SignIn>
						<div
							slot="submitButton"
							class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full text-center"
						>
							Sign in
						</div>
					</SignIn>

					<SignIn provider="google">
						<div
							slot="submitButton"
							class="border border-gray-300 py-2 px-4 rounded-md w-full text-center flex items-center justify-center gap-2 hover:bg-gray-50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="20"
								height="20"
								><path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/><path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/><path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/><path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/></svg
							>
							Sign in with Google
						</div>
					</SignIn>
				</div>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
		<div
			class="feature-card group relative p-6 rounded-xl backdrop-blur-sm border border-gray-200/20
			 dark:border-gray-700/20 bg-white/50 dark:bg-gray-800/50 transition-all duration-300
			 hover:-translate-y-1"
		>
			<div class="feature-shadow"></div>
			<Icons.sun
				class="h-8 w-8 text-amber-500 transform group-hover:rotate-12 transition-all duration-300"
			/>
			<h3 class="text-xl font-bold mb-2">Summer Stories</h3>
			<p class="text-gray-600 dark:text-gray-300">
				Share and discover summer experiences, internships, and
				adventures
			</p>
		</div>

		<div
			class="feature-card group relative p-6 rounded-xl backdrop-blur-sm border border-gray-200/20
			 dark:border-gray-700/20 bg-white/50 dark:bg-gray-800/50 transition-all duration-300
			  hover:-translate-y-1"
		>
			<div class="feature-shadow"></div>
			<Icons.book
				class="h-8 w-8 text-[#8c3030] transform group-hover:rotate-12 transition-all duration-300"
			/>
			<h3 class="text-xl font-bold mb-2">Course Insights</h3>
			<p class="text-gray-600 dark:text-gray-300">
				Get the inside scoop on courses, teachers, and academic life
			</p>
		</div>

		<div
			class="feature-card group relative p-6 rounded-xl backdrop-blur-sm border-gray-200/20 border-2 dark:border hover:shadow-gray-200
			 dark:border-gray-700 bg-white/50 transition-all duration-300 hover:-translate-y-1 hover:border"
		>
			<div class="feature-shadow"></div>
			<Icons.users
				class="h-8 w-8 text-amber-500 transform group-hover:rotate-12 transition-all duration-300"
			/>
			<h3 class="text-xl font-bold mb-2">Club Activities</h3>
			<p class="text-gray-600 dark:text-gray-300">
				Explore clubs, events, and extracurricular opportunities
			</p>
		</div>
	</div>

	<div class="flex flex-col items-center mt-16 space-y-8">
		<p class="call-to-action">
			Join the RC Community Hub today and start sharing your experiences,
			insights, and activities with fellow students!
		</p>
		<AnimatedButton href="/login">
			Start Browing
			<Icons.arrowRight class="ml-2 h-4 w-4" />
		</AnimatedButton>
	</div>
</main>

<style>
	.auth-section {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 0.75rem;
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>
