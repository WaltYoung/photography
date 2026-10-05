/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_MEDIA_BASE_URL: string;
	readonly PUBLIC_COS_BASE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
