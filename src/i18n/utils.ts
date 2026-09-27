import type { Lang, LocalizedString } from '../types/lang';

export function localized(value: LocalizedString, lang: Lang): string {
	return value[lang] ?? value.zh;
}

/** 站内路径（含 base、末尾斜杠） */
export function localePath(lang: Lang, segments: string): string {
	const base = import.meta.env.BASE_URL;
	const path = segments.replace(/^\/+/, '').replace(/\/+$/, '');
	if (lang === 'en') {
		return path ? `${base}en/${path}/` : `${base}en/`;
	}
	return path ? `${base}${path}/` : base;
}

export function alternateUrls(path: string): { zh: string; en: string } {
	return {
		zh: localePath('zh', path),
		en: localePath('en', path),
	};
}

export function formatDate(date: Date, lang: Lang): string {
	return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}
