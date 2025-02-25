<script lang="ts">
	import { page } from "$app/state";
	import { PUBLIC_LANDING_PAGE } from "$env/static/public";

	export let title: string;
	export let description: string;
	export let keywords: string = "default, keywords, here";

	const schemaMarkup = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Your Company Name",
		url: PUBLIC_LANDING_PAGE,
		logo: `${PUBLIC_LANDING_PAGE}/company-logo.svg`,
		description: "Your company description here",
		founder: [
			{
				"@type": "Person",
				name: "Founder Name",
			},
		],
		foundingDate: "2024",
		contactPoint: [
			{
				"@type": "ContactPoint",
				email: "contact@example.com",
				telephone: "+1234567890",
				contactType: "customer service",
			},
		],
	};

	let schemaMarkupScript = `<script type="application/ld+json">${
		JSON.stringify(schemaMarkup) + "<"
	}/script>`;

	$: pathName = page.route.id !== "/" ? page.url.pathname : "";
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={`${PUBLIC_LANDING_PAGE}${pathName}`} />

	<meta property="twitter:url" content={PUBLIC_LANDING_PAGE} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />

	<meta
		data-n-head="1"
		data-hid="og:type"
		property="og:type"
		content="website"
	/>
	<meta
		data-n-head="1"
		data-hid="og:url"
		property="og:url"
		content={`${PUBLIC_LANDING_PAGE}${pathName}`}
	/>
	<meta
		data-n-head="1"
		data-hid="og:title"
		property="og:title"
		content={title}
	/>
	<meta
		data-n-head="1"
		data-hid="og:description"
		property="og:description"
		content={description}
	/>

	<meta
		data-n-head="1"
		data-hid="twitter:url"
		name="twitter:url"
		content={PUBLIC_LANDING_PAGE}
	/>
	<meta
		data-n-head="1"
		data-hid="twitter:title"
		name="twitter:title"
		content={title}
	/>
	<meta
		data-n-head="1"
		data-hid="twitter:description"
		name="twitter:description"
		content={description}
	/>

	<meta data-n-head="1" charset="utf-8" />
	<meta data-n-head="1" name="HandheldFriendly" content="True" />
	<meta data-n-head="1" property="og:site_name" content="Your App Name" />
	<meta data-n-head="1" name="format-detection" content="telephone=no" />
	<meta data-n-head="1" property="og:image:width" content="1280" />
	<meta data-n-head="1" property="og:image:height" content="640" />
	<meta data-n-head="1" name="twitter:site" content="@yourTwitterHandle" />
	<meta data-n-head="1" name="twitter:card" content="summary_large_image" />

	<link
		data-n-head="1"
		data-hid="canonical"
		rel="canonical"
		href={`${PUBLIC_LANDING_PAGE}${pathName}`}
	/>

	<link
		data-n-head="1"
		data-hid="canonical"
		rel="alternate"
		hreflang="x-default"
		href={`${PUBLIC_LANDING_PAGE}${pathName}`}
	/>

	{@html schemaMarkupScript}
</svelte:head>
