/** 里程碑版本（经典浅色布局） */
export const MILESTONE_THEME_VERSION = '1.0.0' as const;

/** 当前默认发布的展示版本 */
export const DEFAULT_SITE_THEME = '1.1.0' as const;

export const SITE_THEME_COOKIE = 'site-theme';
export const SITE_THEME_MAX_AGE = 60 * 60 * 24 * 365;

export const SITE_THEME_VERSIONS = [
	{
		id: MILESTONE_THEME_VERSION,
		label: { zh: '经典 1.0.0', en: 'Classic 1.0.0' },
		description: {
			zh: '浅色卡片布局，初版作品集样式。',
			en: 'Light card layout — original portfolio look.',
		},
	},
	{
		id: '1.1.0',
		label: { zh: '展示 1.1.0', en: 'Showcase 1.1.0' },
		description: {
			zh: '暗色全屏头图，强调作品氛围。',
			en: 'Dark cinematic hero — gallery-first presentation.',
		},
	},
] as const;

export type SiteThemeVersion = (typeof SITE_THEME_VERSIONS)[number]['id'];

export function parseSiteTheme(value: string | undefined | null): SiteThemeVersion | null {
	if (value === MILESTONE_THEME_VERSION || value === '1.1.0') return value;
	return null;
}

export function isSiteThemeVersion(value: string): value is SiteThemeVersion {
	return parseSiteTheme(value) !== null;
}
