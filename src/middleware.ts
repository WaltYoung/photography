import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_SITE_THEME, parseSiteTheme, SITE_THEME_COOKIE } from './lib/theme';

export const onRequest = defineMiddleware(async (context, next) => {
	const raw = context.cookies.get(SITE_THEME_COOKIE)?.value;
	context.locals.siteTheme = parseSiteTheme(raw) ?? DEFAULT_SITE_THEME;
	return next();
});
