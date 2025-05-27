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

	afterNavigate(({ from, to }) => {
		if (from && document.querySelector('meta[name="x-auth-changed"]')) {
			document.querySelector('meta[name="x-auth-changed"]')?.remove();
			invalidateAll();
		}
	});

	onMount(() => {
		const originalFetch = window.fetch;
		window.fetch = async function (input, init) {
			const response = await originalFetch(input, init);
			if (response.headers.get("X-Auth-Changed") === "true") {
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

<div class="relative md:pt-20">
	<Navbar {user} />
	{@render children()}
</div>

<Footer />
