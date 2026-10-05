import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localizedString = z.object({
	zh: z.string(),
	en: z.string(),
});

const tagSchema = z.object({
	slug: z.string(),
	zh: z.string(),
	en: z.string(),
});

const exifSchema = z.object({
	make: z.string().optional(),
	model: z.string().optional(),
	lens: z.string().optional(),
	focalLength: z.string().optional(),
	aperture: z.string().optional(),
	shutter: z.string().optional(),
	iso: z.number().optional(),
});

const categories = defineCollection({
	loader: glob({ base: './src/content/categories', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		slug: z.string(),
		order: z.number().default(0),
		title: localizedString,
		description: localizedString,
		coverKey: z.string(),
	}),
});

const albums = defineCollection({
	loader: glob({ base: './src/content/albums', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		slug: z.string(),
		category: z.string(),
		publishedAt: z.coerce.date(),
		featured: z.boolean().default(false),
		title: localizedString,
		summary: localizedString,
		coverKey: z.string(),
		photoOrder: z.array(z.string()).optional(),
	}),
});

const photos = defineCollection({
	loader: glob({ base: './src/content/photos', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		id: z.string(),
		album: z.string(),
		tags: z.array(tagSchema).default([]),
		takenAt: z.coerce.date(),
		featured: z.boolean().default(false),
		title: localizedString,
		description: localizedString.optional(),
		imageKey: z.string(),
		thumbKey: z.string(),
		width: z.number().int().positive(),
		height: z.number().int().positive(),
		alt: localizedString,
		exif: exifSchema.optional(),
	}),
});

const bio = defineCollection({
	loader: glob({ base: './src/content/bio', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		name: localizedString,
		tagline: localizedString,
		social: z
			.array(
				z.object({
					label: z.string(),
					url: z.string().url(),
				}),
			)
			.optional(),
	}),
});

export const collections = { categories, albums, photos, bio };
