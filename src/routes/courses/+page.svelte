<script lang="ts">
    import AppBackground from "$lib/components/AppBackground.svelte";
    import Seo from "$lib/components/SEO.svelte";

    // You can add any additional logic or data fetching here if needed
    //MOCK Courses data
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

<AppBackground />

<main class="relative mx-auto max-w-5xl px-5 pb-40 sm:px-8">
    <h1 class="text-3xl font-bold text-center mt-10">Available Courses</h1>
    <!-- <CourseList courses={courses} /> -->
</main>
