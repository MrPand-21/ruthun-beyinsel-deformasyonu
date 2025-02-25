<script lang="ts">
	import { Button } from "bits-ui";
	import { toggleMode } from "mode-watcher";
	import { Icons } from "./icons";
</script>

<Button.Root onclick={toggleMode}>
	<Icons.sun
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Icons.moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">toggle theme</span>
</Button.Root>
