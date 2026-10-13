/// <reference types="astro/client" />

type SiteThemeVersion = import('./lib/theme').SiteThemeVersion;

declare namespace App {
	interface Locals {
		siteTheme: SiteThemeVersion;
	}
}

interface ImportMetaEnv {
	readonly PUBLIC_MEDIA_BASE_URL: string;
	readonly PUBLIC_COS_BASE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
