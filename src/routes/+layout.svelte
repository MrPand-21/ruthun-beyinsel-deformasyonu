<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Analytics from "$lib/components/Analytics.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount } from "svelte";
	import { invalidateAll } from "$app/navigation";
	import { afterNavigate } from "$app/navigation";
	import { Toaster } from "svelte-sonner";

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

	const user = $derived(
		data?.user && {
			name: data.user.username,
			email: data.user.email,
		},
	);

	// Check for auth change header after each navigation
	afterNavigate(({ from, to }) => {
		// Only check on client-side navigation (not the initial load)
		if (from && document.querySelector('meta[name="x-auth-changed"]')) {
			// Remove the meta tag to prevent duplicate invalidations
			document.querySelector('meta[name="x-auth-changed"]')?.remove();
			// Invalidate all data to refresh the navbar and locals
			invalidateAll();
		}
	});

	// Add observer to check response headers
	onMount(() => {
		// Create a fetch interceptor to check for auth change headers
		const originalFetch = window.fetch;
		window.fetch = async function (input, init) {
			const response = await originalFetch(input, init);
			// Check if this response indicates an auth change
			if (response.headers.get("X-Auth-Changed") === "true") {
				// Add a meta tag to indicate auth changed - we'll check for this after navigation
				if (!document.querySelector('meta[name="x-auth-changed"]')) {
					const meta = document.createElement("meta");
					meta.name = "x-auth-changed";
					meta.content = "true";
					document.head.appendChild(meta);
				}
			}
			return response;
		};
	});
</script>

<Analytics />

<ModeWatcher defaultMode="light" />
<Toaster position="top-right" richColors />

<div class="">
	<Navbar {user} />
	{@render children()}
</div>

<Footer />
