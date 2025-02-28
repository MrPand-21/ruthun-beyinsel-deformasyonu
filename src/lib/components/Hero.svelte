<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Image from "@zerodevx/svelte-img";
    import LandingImage from "$lib/assets/landing-page.png?as=run";
    import AnimatedButton from "./AnimatedButton.svelte";
    import { Icons } from "./icons";

    const entered = writable(0);

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(
                            entry.target.getAttribute("data-index") || "0",
                            10,
                        );
                        entered.set(index);
                    }
                });
            },
            {
                rootMargin: "-70% 0% -30% 0%",
            },
        );

        document.querySelectorAll("section").forEach((section) => {
            observer.observe(section);
        });
    });
</script>

<div class="max-w-6xl mx-auto mt-12">
    <div class="relative z-0 space-y-12">
        <section data-index="0" class="[--i:0]" style="--e:{$entered}">
            <div
                class="relative bg-indigo-800 rounded-2xl border border-gray-400/20 px-8
                overflow-hidden transition-transform duration-700 ease-in-out z-[2]"
                class:translate-y-0={$entered >= 0}
                class:-translate-y-[calc(100%*(var(--i)-var(--e)))]={$entered <
                    0}
            >
                <div class="md:flex justify-center items-center h-[60vh]">
                    <div
                        class="shrink-0 px-12 flex-col justify-center items-start flex gap-4 py-14 max-md:pb-0 md:max-w-md md:pr-0"
                    >
                        <div
                            class="text-xl text-indigo-400 mb-2 relative inline-flex justify-center items-end"
                        >
                            Beta-Version
                            <svg
                                class="absolute fill-indigo-400 opacity-40 -z-10"
                                xmlns="http://www.w3.org/2000/svg"
                                width="88"
                                height="4"
                                viewBox="0 0 88 4"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M87.343 2.344S60.996 3.662 44.027 3.937C27.057 4.177.686 3.655.686 3.655c-.913-.032-.907-1.923-.028-1.999 0 0 26.346-1.32 43.315-1.593 16.97-.24 43.342.282 43.342.282.904.184.913 1.86.028 1.999"
                                />
                            </svg>
                        </div>
                        <h1
                            class="text-5xl subpixel-antialiased tracking-tight font-extrabold text-slate-50 mb-6"
                        >
                            RC Community Hub
                        </h1>
                        <p class="text-slate-400 mb-8">
                            A platform to learn and share knowledge about summer
                            plans.
                        </p>
                        <AnimatedButton href="/activities">
                            Start Browsing
                            <Icons.arrowRight class="ml-2 h-4 w-4" />
                        </AnimatedButton>
                    </div>
                    <div class="flex justify-center items-center w-full h-full">
                        <Image
                            class="mx-auto my-auto w-full max-w-[20rem] max-md:-translate-x-[5%]"
                            src={LandingImage}
                            alt="Illustration 01"
                        />
                    </div>
                </div>
                <div
                    class="absolute left-16 bottom-0 h-14 flex items-center text-xs font-medium text-slate-400"
                >
                    01
                </div>
            </div>
        </section>

        <section data-index="1" class="[--i:1]" style="--e:{$entered}">
            <div
                class="relative bg-indigo-900 rounded-2xl border border-gray-400/20 px-8
                overflow-hidden transition-transform duration-700 ease-in-out z-[1]"
                class:translate-y-0={$entered >= 1}
                class:-translate-y-[calc(100%*(var(--i)-var(--e)))]={$entered <
                    1}
            >
                <div class="md:flex justify-center items-center">
                    <div
                        class="shrink-0 px-12 flex-col justify-center items-start flex gap-4 py-14 max-md:pb-0 md:max-w-md md:pr-0"
                    >
                        <div
                            class="font-nycd text-xl text-sky-500 mb-2 relative inline-flex justify-center items-end"
                        >
                            Stress Free
                            <svg
                                class="absolute fill-sky-500 opacity-40 -z-10"
                                xmlns="http://www.w3.org/2000/svg"
                                width="88"
                                height="4"
                                viewBox="0 0 88 4"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M87.343 2.344S60.996 3.662 44.027 3.937C27.057 4.177.686 3.655.686 3.655c-.913-.032-.907-1.923-.028-1.999 0 0 26.346-1.32 43.315-1.593 16.97-.24 43.342.282 43.342.282.904.184.913 1.86.028 1.999"
                                />
                            </svg>
                        </div>
                        <h1 class="text-4xl font-extrabold text-slate-50 mb-4">
                            Learn From the Suffered
                        </h1>
                        <p class="text-slate-400 mb-6">
                            Take a look at our advises to circumvent the
                            problems we encountered along the way. We suffered
                            enough for both of us, so you don't have to.
                        </p>
                        <a
                            class="text-sm font-medium inline-flex items-center justify-center px-3 py-1.5 border border-slate-700 rounded-lg tracking-normal transition text-slate-300 hover:text-slate-50 group"
                            href="/advises"
                        >
                            Learn More <span
                                class="text-slate-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1"
                                >-&gt;</span
                            >
                        </a>
                    </div>
                    <div class="relative w-full h-full">
                        <Image
                            class="mx-auto w-full max-w-3xs max-md:-translate-x-[5%]"
                            src={LandingImage}
                            alt="Illustration 01"
                        />
                    </div>
                </div>
                <div
                    class="absolute left-16 bottom-0 h-14 flex items-center text-xs font-medium text-slate-400"
                >
                    02
                </div>
            </div>
        </section>

        <section data-index="2" class="[--i:2]" style="--e:{$entered}">
            <div
                class="relative bg-indigo-950 rounded-2xl border border-gray-400/20 px-8
                overflow-hidden transition-transform duration-700 ease-in-out z-[0]"
                class:translate-y-0={$entered >= 2}
                class:-translate-y-[calc(102.5%*(var(--i)-var(--e)))]={$entered <
                    2}
            >
                <div class="md:flex justify-center items-center">
                    <div
                        class="shrink-0 px-12 flex-col justify-center items-start flex gap-4 py-14 max-md:pb-0 md:max-w-md md:pr-0"
                    >
                        <div
                            class="font-nycd text-xl text-sky-500 mb-2 relative inline-flex justify-center items-end"
                        >
                            Collaboration
                            <svg
                                class="absolute fill-sky-500 opacity-40 -z-10"
                                xmlns="http://www.w3.org/2000/svg"
                                width="88"
                                height="4"
                                viewBox="0 0 88 4"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M87.343 2.344S60.996 3.662 44.027 3.937C27.057 4.177.686 3.655.686 3.655c-.913-.032-.907-1.923-.028-1.999 0 0 26.346-1.32 43.315-1.593 16.97-.24 43.342.282 43.342.282.904.184.913 1.86.028 1.999"
                                />
                            </svg>
                        </div>
                        <h1 class="text-4xl font-extrabold text-slate-50 mb-4">
                            Team Work Is the Dream Work
                        </h1>
                        <p class="text-slate-400 mb-6">
                            Got anything to share? We are all ears. We are
                            looking forward to hearing from you.
                        </p>
                        <a
                            class="text-sm font-medium inline-flex items-center justify-center px-3 py-1.5 border border-slate-700 rounded-lg tracking-normal transition text-slate-300 hover:text-slate-50 group"
                            href="/send"
                        >
                            Learn More <span
                                class="text-slate-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1"
                                >-&gt;</span
                            >
                        </a>
                    </div>
                    <div class="relative w-full h-full">
                        <Image
                            class="mx-auto w-full max-w-3xs max-md:-translate-x-[5%]"
                            src={LandingImage}
                            alt="Illustration 01"
                        />
                    </div>
                </div>
                <div
                    class="absolute left-16 bottom-0 h-14 flex items-center text-xs font-medium text-slate-400"
                >
                    03
                </div>
            </div>
        </section>
    </div>
</div>
