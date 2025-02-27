<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Analytics from "$lib/components/Analytics.svelte";
	import AppBackground from "$lib/components/AppBackground.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<Analytics />

<ModeWatcher />

<AppBackground />

<div class="">
	<Navbar />

	<slot />
</div>

<style>
</style>
