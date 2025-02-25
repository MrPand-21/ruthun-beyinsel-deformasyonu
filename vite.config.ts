import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from '@zerodevx/svelte-img/vite'

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), imagetools()],
	assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
	resolve: {
		alias: {
			$lib: '/src/lib',
			$components: '/src/lib/components',
			$assets: '/src/lib/assets',
		}
	},
	server: {
		fs: {
			allow: ['.'],
		},
		watch: {
			usePolling: true
		}
	},
	optimizeDeps: {
		exclude: ['mode-watcher']
	}
});
