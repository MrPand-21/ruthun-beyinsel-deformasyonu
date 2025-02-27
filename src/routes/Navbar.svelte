<script lang="ts">
	import { Icons } from "$lib/components/icons";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { Button } from "bits-ui";
</script>

<header class="sticky top-0 z-50 w-full bg-background shadow-lg">
	<div
		class="max-w-7xl mx-auto flex items-center justify-between py-3 px-5 sm:px-8"
	>
		<Button.Root href="/" class="nav-item">
			<Icons.home class="h-6 w-6" />
			<span class="nav-label">Home</span>
		</Button.Root>

		<nav class="hidden md:flex space-x-8">
			<a href="/activities" class="nav-item">
				<Icons.activity class="h-6 w-6" />
				<span class="nav-label">Activities</span>
			</a>
			<a href="/advises" class="nav-item">
				<Icons.advice class="h-6 w-6" />
				<span class="nav-label">Advises</span>
			</a>
		</nav>

		<ThemeToggle />
	</div>

	<div class="md:hidden flex justify-around py-3 px-5 sm:px-8">
		<a href="/activities" class="nav-item">
			<Icons.activity class="h-6 w-6" />
			<span class="nav-label">Activities</span>
		</a>
		<a href="/advises" class="nav-item">
			<Icons.advice class="h-6 w-6" />
			<span class="nav-label">Advises</span>
		</a>
	</div>
</header>

<style>
	.nav-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: background-color 0.3s ease;
	}
	.nav-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	.nav-item:hover .nav-label {
		opacity: 1;
		transform: translateY(0);
	}
	.nav-label {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(10px);
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		white-space: nowrap;
		opacity: 0;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}
</style>
