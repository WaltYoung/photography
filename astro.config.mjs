// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/guides/deploy/github/
// 仓库 WaltYoung/photography → GitHub Pages 项目站子路径
const REPO = 'photography';

// https://astro.build/config
export default defineConfig({
	site: 'https://waltyoung.github.io',
	base: `/${REPO}/`,
	output: 'static',
	trailingSlash: 'always',
});
