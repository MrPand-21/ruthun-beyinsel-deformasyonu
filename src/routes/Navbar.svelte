<script lang="ts">
	import { Icons } from "$lib/components/icons";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { Button } from "bits-ui";
</script>

<header class="sticky top-0 z-40 mx-auto w-full bg-background shadow-lg">
	<div class="mx-auto flex max-w-5xl items-center justify-center px-4 py-3">
		<Button.Root href="/">
			<Icons.home class="h-4 w-4" />
		</Button.Root>

		<Button.Root
			href="https://github.com/shamscorner/sveltekit-stackter"
			target="_blank"
			class="ml-auto mr-3"
		>
			<Icons.github class="h-4 w-4" />
		</Button.Root>

		<ThemeToggle />
	</div>
</header>
