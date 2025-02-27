<script lang="ts">
	import { onMount } from "svelte";
	import { ModeWatcher } from "mode-watcher";

	import { page } from "$app/state";
	import "../app.css";
	import Analytics from "$lib/components/Analytics.svelte";
	import AppBackground from "$lib/components/AppBackground.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<ModeWatcher />

<Analytics />

<AppBackground />

<div class="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
	<Navbar />

	<slot />
</div>

<style>
</style>
