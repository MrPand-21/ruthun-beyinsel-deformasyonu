<script lang="ts">
	import Image from "@zerodevx/svelte-img";
	import LandingImage from "$lib/assets/landing-page.png?as=run";
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import AnimatedButton from "$lib/components/AnimatedButton.svelte";
</script>

<Seo
	title="RC Community Hub"
	description="Connect with Robert College community - Share experiences, discuss courses, and explore club activities"
	keywords="robert college, rc community, summer activities, courses, clubs, student experiences"
/>

<main class="relative mx-auto max-w-7xl px-5 pb-40 sm:px-8">
	<div class="hero-content">
		<h1 class="space-y-4">
			<span
				class="block text-2xl font-black md:text-5xl md:leading-[3.5rem] text-amber-500 dark:text-amber-400"
			>
				RC Community Hub
				<div class="hero-blur"></div>
			</span>
			<span
				class="block mt-4 text-lg font-medium text-gray-700 dark:text-gray-300"
			>
				Where Robert College Stories Come Together
			</span>
		</h1>
		<h2
			class="max-w-lg mt-6 font-medium md:text-lg text-gray-600 dark:text-gray-400"
		>
			Share your journey, explore opportunities, and connect with the RC
			community
		</h2>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
		<div class="feature-card group">
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

		<div class="feature-card group">
			<div class="feature-shadow"></div>
			<Icons.book
				class="h-8 w-8 text-[#8c3030] transform group-hover:rotate-12 transition-all duration-300"
			/>
			<h3 class="text-xl font-bold mb-2">Course Insights</h3>
			<p class="text-gray-600 dark:text-gray-300">
				Get the inside scoop on courses, teachers, and academic life
			</p>
		</div>

		<div class="feature-card group">
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
		<p class="call-to-action">Join the conversation today</p>
		<AnimatedButton href="/login">
			Start Sharing
			<Icons.arrowRight class="ml-2 h-4 w-4" />
		</AnimatedButton>
	</div>
</main>
