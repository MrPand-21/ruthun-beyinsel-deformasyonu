<script lang="ts">
    import Seo from "$lib/components/SEO.svelte";
    import ComponentCard from "$lib/components/ui/ComponentCard.svelte";

    const courses = [
        {
            id: 1,
            title: "Introduction to Computer Science",
            description:
                "Learn the fundamentals of computer science and programming.",
            image: "https://via.placeholder.com/300x200",
        },
        {
            id: 2,
            title: "Web Development Fundamentals",

            description: "Explore the basics of web development and design.",
            image: "https://via.placeholder.com/300x200",
        },
    ];
</script>

<Seo
    title="Courses - Student Activities"
    description="Explore various courses available for high school students."
    keywords="courses, high school, education, student activities"
/>

<main class="relative mx-auto max-w-5xl px-5 pb-40 sm:px-8">
    <ComponentCard
        title="Courses"
        desc="Explore various courses available for high school students."
        className="mt-10"
    >
        {#each courses as course}
            <div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <img src={course.image} alt={course.title} />
            </div>
        {/each}
    </ComponentCard>
</main>
