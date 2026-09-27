/** 将 content 中的 object key 拼成 COS 公网 URL */
export function cosUrl(key: string): string {
	const base = import.meta.env.PUBLIC_COS_BASE_URL;
	if (!base) {
		throw new Error('PUBLIC_COS_BASE_URL is not set (see .env.example)');
	}
	return `${base.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
}
