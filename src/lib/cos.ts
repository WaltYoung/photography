/** 将 R2 / 对象存储 key 拼成公网 URL（按路径段 URL 编码） */
export function cosUrl(key: string): string {
	const base =
		import.meta.env.PUBLIC_MEDIA_BASE_URL ?? import.meta.env.PUBLIC_COS_BASE_URL;
	if (!base) {
		throw new Error('PUBLIC_MEDIA_BASE_URL is not set (see .env.example)');
	}
	const normalized = key.replace(/^\//, '');
	const encoded = normalized
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/');
	return `${base.replace(/\/$/, '')}/${encoded}`;
}
