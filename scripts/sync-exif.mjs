#!/usr/bin/env node
/**
 * 从本地图片提取 EXIF 并打印 YAML 片段，便于粘贴到 src/content/photos/*.md
 * 用法: node scripts/sync-exif.mjs ./path/to/image.jpg
 */
import { readFile } from 'node:fs/promises';
import exifr from 'exifr';
const { parse } = exifr;

const file = process.argv[2];
if (!file) {
	console.error('Usage: node scripts/sync-exif.mjs <image-file>');
	process.exit(1);
}

const buf = await readFile(file);
const data = await parse(buf, { pick: ['Make', 'Model', 'LensModel', 'FocalLength', 'FNumber', 'ExposureTime', 'ISO', 'DateTimeOriginal'] });

const focal = data?.FocalLength ? `${Math.round(data.FocalLength)}mm` : undefined;
const aperture = data?.FNumber ? `f/${data.FNumber}` : undefined;
const shutter =
	data?.ExposureTime != null
		? data.ExposureTime >= 1
			? `${data.ExposureTime}s`
			: `1/${Math.round(1 / data.ExposureTime)}s`
		: undefined;

console.log('exif:');
console.log(`  make: ${data?.Make ?? ''}`);
console.log(`  model: ${data?.Model ?? ''}`);
console.log(`  lens: ${data?.LensModel ?? ''}`);
console.log(`  focalLength: ${focal ?? ''}`);
console.log(`  aperture: ${aperture ?? ''}`);
console.log(`  shutter: ${shutter ?? ''}`);
console.log(`  iso: ${data?.ISO ?? ''}`);
if (data?.DateTimeOriginal) {
	console.log(`takenAt: ${new Date(data.DateTimeOriginal).toISOString()}`);
}
