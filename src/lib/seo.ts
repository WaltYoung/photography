import type { Lang } from '../types/lang';
import { alternateUrls, localePath } from '../i18n/utils';

export function siteTitle(pageTitle: string | undefined, lang: Lang): string {
	const brand = lang === 'zh' ? 'WaltYoung 摄影' : 'WaltYoung Photography';
	return pageTitle ? `${pageTitle} · ${brand}` : brand;
}

export function canonicalUrl(lang: Lang, path: string): string {
	return `${import.meta.env.SITE}${localePath(lang, path)}`;
}

export { alternateUrls };
