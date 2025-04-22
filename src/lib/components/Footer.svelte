<script lang="ts">
    import { Button } from "bits-ui";
    import { Icons } from "./icons";
</script>

<footer
    class="relative mt-8 border-t-2 border-gray-400/20 dark:border-gray-800/30"
>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            class="absolute -top-10 left-1/2 w-[800px] h-[800px] -translate-x-1/2 opacity-20 dark:opacity-10"
        >
            <div
                class="absolute inset-0 bg-gradient-to-r from-amber-300/30 via-secondary-soft/20 to-indigo-300/30 blur-3xl rounded-full"
            ></div>
        </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            <div class="lg:col-span-1">
                <div class="flex items-center space-x-2 mb-4">
                    <Icons.home class="h-6 w-6 text-secondary" />
                    <h2 class="text-xl font-bold">RC Community</h2>
                </div>
                <p class="text-fr/80 dark:text-fr/70 text-sm">
                    Connecting students and alumni through shared experiences
                    and knowledge.
                </p>
                <div class="flex space-x-4 mt-6">
                    <a
                        href="#a"
                        aria-label="Twitter"
                        class="text-gray-500 hover:text-secondary transition-colors"
                    >
                        <Icons.twitter class="h-5 w-5" />
                    </a>
                    <a
                        href="#a"
                        aria-label="Instagram"
                        class="text-gray-500 hover:text-secondary transition-colors"
                    >
                        <Icons.camera class="h-5 w-5" />
                    </a>
                    <a
                        href="#a"
                        aria-label="LinkedIn"
                        class="text-gray-500 hover:text-secondary transition-colors"
                    >
                        <Icons.linkedin class="h-5 w-5" />
                    </a>
                </div>
            </div>

            <div>
                <h3
                    class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4"
                >
                    Explore
                </h3>
                <ul class="space-y-3">
                    <li>
                        <a
                            href="/"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Home</a
                        >
                    </li>
                    <li>
                        <a
                            href="/activities"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Activities</a
                        >
                    </li>
                    <li>
                        <a
                            href="/courses"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Courses</a
                        >
                    </li>
                    <li>
                        <a
                            href="/advises"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Advises</a
                        >
                    </li>
                </ul>
            </div>

            <div>
                <h3
                    class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4"
                >
                    Resources
                </h3>
                <ul class="space-y-3">
                    <li>
                        <a
                            href="#a"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >FAQ</a
                        >
                    </li>
                    <li>
                        <a
                            href="#a"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Privacy Policy</a
                        >
                    </li>
                    <li>
                        <a
                            href="#aa"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Terms of Service</a
                        >
                    </li>
                    <li>
                        <a
                            href="#a"
                            class="text-fr/80 hover:text-secondary transition-colors"
                            >Contact</a
                        >
                    </li>
                </ul>
            </div>

            <div class="lg:col-span-1">
                <h3
                    class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4"
                >
                    Stay Updated
                </h3>
                <p class="text-fr/80 dark:text-fr/70 text-sm mb-4">
                    Subscribe to our newsletter for updates.
                </p>
                <form class="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        placeholder="Your email"
                        class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all"
                    />
                    <Button.Root
                        type="submit"
                        class="rounded-input border-amber-500  border-2 rounded-md shadow-md transition-all duration-200
                         text-[15px] hover:brightness-105 px-2.5 hover:cursor-pointer hover:bg-amber-600/60
                        font-semibold active:scale-[0.98] active:transition-all"
                    >
                        Subscribe
                    </Button.Root>
                </form>
            </div>
        </div>

        <div
            class="border-t border-gray-200/20 dark:border-gray-800/30 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
            <p class="text-gray-500 text-sm">
                © {new Date().getFullYear()} RC Community. All rights reserved.
            </p>
            <p class="text-gray-500 text-sm mt-2 md:mt-0">
                Made with ❤️ by RC students
            </p>
        </div>
    </div>
</footer>
