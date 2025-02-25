<script lang="ts">
	import Image from "@zerodevx/svelte-img";
	import LandingImage from "$lib/assets/landing-page.png?as=run";
	import Seo from "$lib/components/SEO.svelte";
	import { Button } from "bits-ui";
	import { Icons } from "$lib/components/icons";
</script>

<Seo
	title="My App Title"
	description="Welcome to my application"
	keywords="app, svelte, typescript"
/>

<main class="relative mx-auto max-w-5xl px-5 pb-40 sm:px-8">
	<div class="grid grid-cols-1 place-items-center gap-10 md:grid-cols-2">
		<div class="space-y-6 pt-5 md:pt-10">
			<h1
				class="max-w-lg text-2xl font-extrabold md:text-4xl md:leading-[3rem]"
			>
				Welcome to Our Application
			</h1>
			<h2 class="max-w-lg font-medium md:text-lg">
				Discover amazing features and capabilities
			</h2>
		</div>
	</div>

	<div class="flex flex-col gap-8 md:flex-row">
		<div class="flex-1">
			<div class="space-y-5 py-10 text-center">
				<p class="text-lg font-semibold">Try our form submission</p>
				<Button.Root href="/login">
					Go to Login
					<Icons.arrowRight class="ml-2 h-4 w-4" />
				</Button.Root>
			</div>

			<div class="space-y-8 text-center">
				<Image
					src={LandingImage}
					alt="App Logo"
					loading="eager"
					class="mx-auto mt-16 w-96"
				/>
			</div>
		</div>
	</div>
</main>
