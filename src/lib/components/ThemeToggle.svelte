<script lang="ts">
	import { Button } from "bits-ui";
	import { mode, toggleMode } from "mode-watcher";
	import { Icons } from "./icons";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	// Fix dark mode by properly applying the class
	onMount(() => {
		if (browser) {
			// Initialize with saved preference
			const currentMode =
				$mode || localStorage.getItem("mode") || "light";
			if (currentMode === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	});

	function handleClick() {
		toggleMode();
		if (browser) {
			// Toggle class for Tailwind
			if (document.documentElement.classList.contains("dark")) {
				document.documentElement.classList.remove("dark");
			} else {
				document.documentElement.classList.add("dark");
			}
		}
	}
</script>

<Button.Root
	onclick={handleClick}
	class=" relative group overflow-hidden rounded-full p-2 bg-slate-100 hover:bg-slate-200 cursor-pointer
		 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-300 shadow-md hover:shadow-lg"
>
	<div class="relative z-10 flex items-center justify-center">
		<Icons.sun
			class="h-[1.4rem] w-[1.4rem] text-amber-500 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0"
		/>
		<Icons.moon
			class="absolute h-[1.4rem] w-[1.4rem] text-indigo-400 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
		/>
	</div>
	<span class="sr-only">Toggle theme</span>

	<span
		class="absolute inset-0 transform translate-y-full dark:translate-y-0 bg-gradient-to-br from-indigo-400 to-indigo-700 opacity-20 group-hover:opacity-30 transition-transform duration-500"
	></span>
	<span
		class="absolute inset-0 transform translate-y-0 dark:translate-y-full bg-gradient-to-tr from-amber-200 to-amber-400 opacity-20 group-hover:opacity-30 transition-transform duration-500"
	></span>
</Button.Root>
