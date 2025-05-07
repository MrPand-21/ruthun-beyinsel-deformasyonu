<script>
    import { redirect } from "@sveltejs/kit";

    // This page shouldn't be directly accessed - it's only for form submissions
    // Redirect if someone visits /logout directly
    redirect(302, "/");
</script>
