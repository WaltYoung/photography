#!/usr/bin/env node
/**
 * 从 R2 公网 URL 读取 EXIF，写回 src/content/photos/*.md
 * PUBLIC_MEDIA_BASE_URL=https://20011129.xyz node scripts/batch-sync-exif-from-r2.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';
const { parse } = exifr;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHOTOS_DIR = path.join(ROOT, 'src/content/photos');
const BASE = process.env.PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '');

if (!BASE) {
	console.error('Set PUBLIC_MEDIA_BASE_URL (e.g. https://20011129.xyz)');
	process.exit(1);
}

function mediaUrl(key) {
	const encoded = key
		.replace(/^\//, '')
		.split('/')
		.map((s) => encodeURIComponent(s))
		.join('/');
	return `${BASE}/${encoded}`;
}

function formatShutter(exposureTime) {
	if (exposureTime == null) return undefined;
	if (exposureTime >= 1) return `${exposureTime}s`;
	return `1/${Math.round(1 / exposureTime)}s`;
}

function formatFocal(length) {
	if (length == null) return undefined;
	return `${Math.round(length)}mm`;
}

function formatAperture(f) {
	if (f == null) return undefined;
	return `f/${f}`;
}

function yamlQuote(s) {
	return JSON.stringify(String(s));
}

function buildExifYaml(exif) {
	const lines = [];
	if (exif.make) lines.push(`  make: ${yamlQuote(exif.make)}`);
	if (exif.model) lines.push(`  model: ${yamlQuote(exif.model)}`);
	if (exif.lens) lines.push(`  lens: ${yamlQuote(exif.lens)}`);
	if (exif.focalLength) lines.push(`  focalLength: ${yamlQuote(exif.focalLength)}`);
	if (exif.aperture) lines.push(`  aperture: ${yamlQuote(exif.aperture)}`);
	if (exif.shutter) lines.push(`  shutter: ${yamlQuote(exif.shutter)}`);
	if (exif.iso != null) lines.push(`  iso: ${exif.iso}`);
	if (lines.length === 0) return null;
	return `exif:\n${lines.join('\n')}`;
}

async function extractExif(url) {
	try {
		const data = await parse(url, {
			pick: [
				'Make',
				'Model',
				'LensModel',
				'FocalLength',
				'FNumber',
				'ExposureTime',
				'ISO',
				'DateTimeOriginal',
				'ExifImageWidth',
				'ExifImageHeight',
				'ImageWidth',
				'ImageHeight',
				'Orientation',
			],
			reviveValues: true,
		});
		if (!data || Object.keys(data).length === 0) return null;

		const width = data.ExifImageWidth ?? data.ImageWidth;
		const height = data.ExifImageHeight ?? data.ImageHeight;
		let w = width;
		let h = height;
		if (data.Orientation >= 5 && data.Orientation <= 8 && w && h) {
			[w, h] = [h, w];
		}

		return {
			exif: {
				make: data.Make,
				model: data.Model,
				lens: data.LensModel,
				focalLength: formatFocal(data.FocalLength),
				aperture: formatAperture(data.FNumber),
				shutter: formatShutter(data.ExposureTime),
				iso: data.ISO,
			},
			takenAt: data.DateTimeOriginal ? new Date(data.DateTimeOriginal).toISOString() : undefined,
			width: w ? Math.round(w) : undefined,
			height: h ? Math.round(h) : undefined,
		};
	} catch (err) {
		return { error: err.message };
	}
}

function patchFrontmatter(raw, patch) {
	const m = raw.match(/^---\n([\s\S]*?)\n---(\n*)$/);
	if (!m) return raw;
	let fm = m[1];
	fm = fm.replace(/\nexif:\n(?:  .+\n)+/g, '');
	if (patch.exifYaml) fm += `\n${patch.exifYaml}`;
	if (patch.takenAt) fm = fm.replace(/^takenAt: .+$/m, `takenAt: ${patch.takenAt}`);
	if (patch.width) fm = fm.replace(/^width: \d+$/m, `width: ${patch.width}`);
	if (patch.height) fm = fm.replace(/^height: \d+$/m, `height: ${patch.height}`);
	return `---\n${fm}\n---${m[2]}`;
}

async function main() {
	const files = (await readdir(PHOTOS_DIR)).filter((f) => f.endsWith('.md'));
	let ok = 0;
	let skipped = 0;
	let failed = 0;

	for (const file of files) {
		const filePath = path.join(PHOTOS_DIR, file);
		const raw = await readFile(filePath, 'utf8');
		const keyMatch = raw.match(/^imageKey:\s*(.+)$/m);
		if (!keyMatch) {
			skipped += 1;
			continue;
		}
		const key = keyMatch[1].trim().replace(/^["']|["']$/g, '');
		const url = mediaUrl(key);
		process.stdout.write(`${file} … `);
		const result = await extractExif(url);
		if (!result || result.error) {
			console.log(result?.error ? `skip (${result.error})` : 'no exif');
			skipped += 1;
			continue;
		}
		const exifYaml = buildExifYaml(result.exif);
		if (!exifYaml) {
			console.log('no exif fields');
			skipped += 1;
			continue;
		}
		const updated = patchFrontmatter(raw, {
			exifYaml,
			takenAt: result.takenAt,
			width: result.width,
			height: result.height,
		});
		await writeFile(filePath, updated, 'utf8');
		console.log('ok');
		ok += 1;
	}

	console.log(`Done: ${ok} updated, ${skipped} skipped, ${failed} failed.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
