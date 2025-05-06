<script lang="ts">
	import Seo from "$lib/components/SEO.svelte";
	import LoginForm from "./login-form.svelte";

	let { data } = $props();
</script>

<Seo
	title="Login Page"
	description="Login Page Desc"
	keywords="Keywords to be updated"
/>

<main class="relative p-5 py-6 sm:px-8">
	<div class="mx-auto my-12 grid max-w-5xl place-items-center">
		<LoginForm data={data.form} />
	</div>
</main>
