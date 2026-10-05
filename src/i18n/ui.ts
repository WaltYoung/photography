import type { Lang } from '../types/lang';

const ui = {
	nav: {
		home: { zh: '首页', en: 'Home' },
		about: { zh: '简介', en: 'About' },
		categories: { zh: '分类', en: 'Categories' },
		albums: { zh: '相册', en: 'Albums' },
		tags: { zh: '标签', en: 'Tags' },
		search: { zh: '搜索', en: 'Search' },
	},
	actions: {
		viewWork: { zh: '查看作品', en: 'View work' },
		viewAlbum: { zh: '进入相册', en: 'Open album' },
		allAlbums: { zh: '全部相册', en: 'All albums' },
		back: { zh: '返回', en: 'Back' },
		fullscreen: { zh: '全屏查看', en: 'Fullscreen' },
	},
	home: {
		featured: { zh: '精选', en: 'Featured' },
		latestAlbums: { zh: '最新相册', en: 'Latest albums' },
		byCategory: { zh: '按分类浏览', en: 'Browse by category' },
	},
	photo: {
		exifTitle: { zh: '拍摄参数', en: 'Capture details' },
		make: { zh: '机身', en: 'Camera' },
		lens: { zh: '镜头', en: 'Lens' },
		focalLength: { zh: '焦距', en: 'Focal length' },
		aperture: { zh: '光圈', en: 'Aperture' },
		shutter: { zh: '快门', en: 'Shutter' },
		iso: { zh: 'ISO', en: 'ISO' },
		takenAt: { zh: '拍摄时间', en: 'Taken' },
		inAlbum: { zh: '所属相册', en: 'Album' },
		tags: { zh: '标签', en: 'Tags' },
	},
	search: {
		title: { zh: '站内搜索', en: 'Search' },
		hint: {
			zh: '搜索相册、照片标题与标签。需先构建站点后索引才可用。',
			en: 'Search albums, titles, and tags. Index is available after a production build.',
		},
		devNotice: {
			zh: '开发模式下 Pagefind 索引未生成，请运行 npm run build && npm run preview 体验搜索。',
			en: 'Pagefind index is not generated in dev. Run npm run build && npm run preview to try search.',
		},
	},
	footer: {
		copyright: { zh: '保留所有权利。', en: 'All rights reserved.' },
		stack: {
			zh: 'Astro · Cloudflare R2 · GitHub Pages',
			en: 'Astro · Cloudflare R2 · GitHub Pages',
		},
	},
	notFound: {
		title: { zh: '页面未找到', en: 'Page not found' },
		body: { zh: '你访问的页面不存在。', en: 'The page you requested does not exist.' },
	},
} as const;

export function t<K extends keyof typeof ui>(
	section: K,
	key: keyof (typeof ui)[K],
	lang: Lang,
): string {
	const entry = ui[section][key] as { zh: string; en: string };
	return entry[lang];
}

export { ui };
