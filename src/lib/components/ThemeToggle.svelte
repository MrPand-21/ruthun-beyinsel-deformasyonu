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
	class=" relative group overflow-hidden rounded-md w-full h-full flex-1 p-2.5  hover:bg-amber-200/40 cursor-pointer
		  dark:hover:bg-slate-700 transition-colors duration-300 z-10 flex items-center justify-center "
>
	<Icons.sun
		class="h-5 w-5 text-amber-500 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0"
	/>
	<Icons.moon
		class="absolute h-5 w-5 text-indigo-400 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button.Root>
