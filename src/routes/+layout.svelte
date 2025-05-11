<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Analytics from "$lib/components/Analytics.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";

	const { data, children } = $props();
	const user = {
		name: data.username,
		email: data.email,
	};
</script>

<Analytics />

<ModeWatcher />

<div class="">
	<Navbar {user} />
	{@render children()}
</div>

<Footer />
