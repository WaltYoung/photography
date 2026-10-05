/** 仓库内静态品牌资源（public/），构建时复制到 dist，不请求外链 */
export function staticAsset(path: string): string {
	const normalized = path.replace(/^\//, '');
	return `${import.meta.env.BASE_URL}${normalized}`;
}

export const AVATAR_SRC = staticAsset('avatar.jpg');
