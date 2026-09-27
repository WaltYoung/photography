// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const REPO = 'photography';

// https://astro.build/config
export default defineConfig({
	site: 'https://waltyoung.github.io',
	base: `/${REPO}/`,
	output: 'static',
	trailingSlash: 'always',
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
