<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import { Icons } from "$lib/components/icons";
	import AnimatedButton from "$lib/components/AnimatedButton.svelte";
	import Hero from "$lib/components/Hero.svelte";
</script>

<Seo
	title="RC Community Hub"
	description="Connect with Robert College community - Share experiences, discuss courses, and explore club activities"
	keywords="robert college, rc community, summer activities, courses, clubs, student experiences"
/>

<main class="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8">
	<Hero />

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
			Start Browsing
			<Icons.arrowRight class="ml-2 h-4 w-4" />
		</AnimatedButton>
	</div>
</main>
