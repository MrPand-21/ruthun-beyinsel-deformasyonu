<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Analytics from "$lib/components/Analytics.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";

	const {
		data,
		children,
	}: {
		data: {
			user: {
				username: string;
				email: string;
			};
		} | null;
		children: () => any;
	} = $props();

	const user = data?.user && {
		name: data.user.username,
		email: data.user.email,
	};
</script>

<Analytics />

<ModeWatcher defaultMode="light" />

<div class="">
	<Navbar {user} />
	{@render children()}
</div>

<Footer />
