<script lang="ts">
	import { page } from "$app/state";
	import Seo from "$lib/components/SEO.svelte";
</script>

<Seo
	title={`Error ${page.status}`}
	description={"sonra"}
	keywords={"error, falan"}
/>

<main class="grid h-full place-content-center gap-2 text-center">
	<h1 class="text-3xl">{page.status}</h1>
	<p>{page.error?.message}!</p>
</main>
