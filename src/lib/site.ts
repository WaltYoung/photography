/** 站点首次上线年份（用于页脚版权区间） */
export const SITE_START_YEAR = 2026;

export function copyrightYears(now = new Date()): string {
	const y = now.getFullYear();
	return y === SITE_START_YEAR ? String(y) : `${SITE_START_YEAR}–${y}`;
}
