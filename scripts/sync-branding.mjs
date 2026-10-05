#!/usr/bin/env node
/**
 * 从 COS 拉取头像一次，生成 public/ 内静态 avatar 与 favicon（提交到 Git，站点不再外链请求）。
 * 用法: node scripts/sync-branding.mjs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SOURCE_URL =
	'https://waltyoung-music-1317864421.cos.ap-shanghai.myqcloud.com/avatar/avatar-5.jpg';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

async function fetchSource() {
	const res = await fetch(SOURCE_URL, {
		headers: { Referer: 'https://waltyoung.github.io/' },
	});
	if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
	return Buffer.from(await res.arrayBuffer());
}

async function main() {
	await mkdir(PUBLIC, { recursive: true });
	const buf = await fetchSource();
	const img = sharp(buf).rotate();

	await img
		.clone()
		.resize(512, 512, { fit: 'cover', position: 'attention' })
		.jpeg({ quality: 85, mozjpeg: true })
		.toFile(path.join(PUBLIC, 'avatar.jpg'));

	await img.clone().resize(32, 32, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(path.join(PUBLIC, 'favicon-32x32.png'));
	await img.clone().resize(16, 16, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(path.join(PUBLIC, 'favicon-16x16.png'));
	await img
		.clone()
		.resize(180, 180, { fit: 'cover' })
		.png({ compressionLevel: 9 })
		.toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

	console.log('Wrote public/avatar.jpg, favicon-*.png, apple-touch-icon.png');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
