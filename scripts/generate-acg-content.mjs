#!/usr/bin/env node
/**
 * 根据 R2 目录结构生成 albums / photos content md
 * 运行: node scripts/generate-acg-content.mjs
 */
import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHOTOS_DIR = path.join(ROOT, 'src/content/photos');
const ALBUMS_DIR = path.join(ROOT, 'src/content/albums');

const STANDARD_TAGS = [
	{ slug: 'portrait', zh: '人像', en: 'Portrait' },
	{ slug: 'cosplay', zh: 'Cosplay', en: 'Cosplay' },
	{ slug: 'convention', zh: '场照', en: 'On-site' },
];

/** event / character / filenames */
const ALBUMS = [
	{
		event: '2026.05.03 武汉梦乡漫展',
		character: '妲己_盒子',
		files: ['_MG_0030.jpg', '_MG_0036.jpg', '_MG_0037.jpg', '_MG_0043 - 已去除背景人像.jpg'],
	},
	{ event: '2026.05.03 武汉梦乡漫展', character: '宁荣荣', files: ['_MG_9896.jpg', '_MG_9901.jpg'] },
	{
		event: '2026.05.03 武汉梦乡漫展',
		character: '小昔涟',
		files: [
			'_MG_9856.jpg',
			'_MG_9859.jpg',
			'_MG_9859_2.jpg',
			'_MG_9863.jpg',
			'_MG_9867.jpg',
			'_MG_9873.jpg',
			'_MG_9881.jpg',
			'_MG_9892.jpg',
		],
	},
	{ event: '2026.05.03 武汉梦乡漫展', character: '缇宝', files: ['_MG_9910.jpg', '_MG_9929.jpg'] },
	{ event: '2026.05.03 武汉梦乡漫展', character: '长夜月', files: ['_MG_9917.jpg', '_MG_9922.jpg', '_MG_9927.jpg'] },
	{
		event: '2026.05.23 武汉DP漫展',
		character: '叶瞬光',
		files: ['_MG_0132.jpg', '_MG_0133.jpg', '_MG_0134.jpg', '_MG_0136.jpg'],
	},
	{ event: '2026.05.23 武汉DP漫展', character: '澜', files: ['_MG_0241.jpg', '_MG_0242.jpg', '_MG_0246.jpg', '_MG_0252.JPG'] },
	{
		event: '2026.06.20 武汉X118',
		character: '妲己「抹茶甜心」',
		files: ['1-output.jpg', '2-output.jpg'],
	},
	{ event: '2026.06.20 武汉X118', character: '富冈义勇', files: ['_MG_0531.png', '_MG_0536.png'] },
	{ event: '2026.06.20 武汉X118', character: '玛修', files: ['_MG_0556.png', '_MG_0557.png'] },
	{
		event: '2026.07.18 武汉梦乡漫展',
		character: '甘雨',
		files: ['_MG_0934.jpg', '_MG_0935.jpg', '_MG_0940-模特返图.jpg'],
	},
	{
		event: '2026.07.18 武汉梦乡漫展',
		character: '神里绫人',
		files: [
			'_MG_1060-模特返图.jpg',
			'_MG_1061-模特返图.jpg',
			'_MG_1063-模特返图.jpg',
			'_MG_1070-模特返图.jpg',
			'_MG_1073-模特返图.jpg',
			'_MG_1158-模特返图.jpg',
		],
	},
	{
		event: '2026.07.18 武汉梦乡漫展',
		character: '芙宁娜',
		files: [
			'_MG_1017.jpg',
			'_MG_1018.jpg',
			'_MG_1024.jpg',
			'_MG_1028.jpg',
			'_MG_1036.jpg',
			'_MG_1048.jpg',
			'_MG_1088.jpg',
			'_MG_1090.jpg',
			'_MG_1101.jpg',
			'_MG_1109.jpg',
			'_MG_1114.jpg',
			'_MG_1120.jpg',
		],
	},
	{
		event: '2026.07.18 武汉梦乡漫展',
		character: '西施「游龙清影」',
		files: ['_MG_0957-模特返图.png', '_MG_0964-模特返图.png', '_MG_0966-模特返图.png'],
	},
	{
		event: '2026.07.18 武汉梦乡漫展',
		character: '西施「游龙清影」 -甜吱',
		files: ['_MG_1007.jpg'],
	},
	{
		event: '2026.07.18 武汉梦乡漫展',
		character: '阿格莱雅',
		files: ['_MG_0915.png', '_MG_0916.png', '_MG_0917.png'],
	},
	{
		event: '2026.07.25 武汉CGF漫展',
		character: '刻晴',
		files: ['_MG_1362-模特返图.jpg', '_MG_1366-模特返图.jpg'],
	},
	{
		event: '2026.07.25 武汉CGF漫展',
		character: '刻晴「花嫁」',
		files: ['_MG_1334-模特返图.jpg', '_MG_1344-模特返图.jpg'],
	},
	{
		event: '2026.07.25 武汉CGF漫展',
		character: '阿格莱雅',
		files: ['_MG_1240.png', '_MG_1256.png', '_MG_1260.png'],
	},
	{
		event: '2026.08.08 武汉环形宇宙漫展',
		character: 'CC',
		files: ['IMG_4321.JPG', 'IMG_4325.JPG', 'IMG_4328.JPG'],
	},
	{
		event: '2026.08.08 武汉环形宇宙漫展',
		character: '东方曜',
		files: ['_MG_1469_2.png', '_MG_1470_2.png', '_MG_1484_2.png', '_MG_1510_2.png'],
	},
];

function objectKey(event, character, filename) {
	return `photo/acg/${event}/${character}/${filename}`;
}

function shortHash(input) {
	return createHash('sha256').update(input).digest('hex').slice(0, 10);
}

function parseEventDate(event) {
	const m = event.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
	if (!m) return { iso: '2026-01-01', published: '2026-01-01' };
	return {
		iso: `${m[1]}-${m[2]}-${m[3]}T12:00:00+08:00`,
		published: `${m[1]}-${m[2]}-${m[3]}`,
	};
}

function albumSlug(event, character) {
	return `acg-${shortHash(`${event}/${character}`)}`;
}

function photoId(key) {
	return `p-${shortHash(key)}`;
}

function yamlString(s) {
	return JSON.stringify(s);
}

function tagsYaml() {
	return STANDARD_TAGS.map(
		(t) => `  - slug: ${t.slug}\n    zh: ${yamlString(t.zh)}\n    en: ${yamlString(t.en)}`,
	).join('\n');
}

function titleFromFilename(name) {
	return name.replace(/\.(jpe?g|png|gif|webp)$/i, '');
}

async function main() {
	await rm(PHOTOS_DIR, { recursive: true, force: true });
	await rm(ALBUMS_DIR, { recursive: true, force: true });
	await mkdir(PHOTOS_DIR, { recursive: true });
	await mkdir(ALBUMS_DIR, { recursive: true });

	let albumIndex = 0;
	let globalPhotoIndex = 0;
	for (const album of ALBUMS) {
		const slug = albumSlug(album.event, album.character);
		const { iso, published } = parseEventDate(album.event);
		const titleZh = `${album.event} · ${album.character}`;
		const titleEn = `${album.event} · ${album.character}`;
		const photoIds = [];
		const coverKey = objectKey(album.event, album.character, album.files[0]);

		for (const file of album.files) {
			const key = objectKey(album.event, album.character, file);
			const id = photoId(key);
			photoIds.push(id);
			const baseTitle = titleFromFilename(file);
			const md = `---
id: ${id}
album: ${slug}
tags:
${tagsYaml()}
takenAt: ${iso}
featured: ${globalPhotoIndex++ < 10}
title:
  zh: ${yamlString(`${album.character} — ${baseTitle}`)}
  en: ${yamlString(`${album.character} — ${baseTitle}`)}
imageKey: ${yamlString(key)}
thumbKey: ${yamlString(key)}
width: 4000
height: 6000
alt:
  zh: ${yamlString(`${album.character} 场照`)}
  en: ${yamlString(`${album.character} convention photo`)}
---
`;
			await writeFile(path.join(PHOTOS_DIR, `${id}.md`), md, 'utf8');
		}

		const featured = albumIndex < 4;
		albumIndex += 1;
		const albumMd = `---
slug: ${slug}
category: anime
publishedAt: ${published}
featured: ${featured}
title:
  zh: ${yamlString(titleZh)}
  en: ${yamlString(titleEn)}
summary:
  zh: ${yamlString(`${album.character} · ${album.event}`)}
  en: ${yamlString(`${album.character} · ${album.event}`)}
coverKey: ${yamlString(coverKey)}
photoOrder:
${photoIds.map((id) => `  - ${id}`).join('\n')}
---
`;
		await writeFile(path.join(ALBUMS_DIR, `${slug}.md`), albumMd, 'utf8');
	}

	console.log(`Generated ${ALBUMS.length} albums, ${ALBUMS.reduce((n, a) => n + a.files.length, 0)} photos.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
