import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../types/lang';
import { localized } from '../i18n/utils';

export type PhotoEntry = CollectionEntry<'photos'>;
export type AlbumEntry = CollectionEntry<'albums'>;
export type CategoryEntry = CollectionEntry<'categories'>;

export async function getCategoriesSorted(): Promise<CategoryEntry[]> {
	const items = await getCollection('categories');
	return items.sort((a, b) => a.data.order - b.data.order);
}

export async function getAlbumsSorted(): Promise<AlbumEntry[]> {
	const items = await getCollection('albums');
	return items.sort(
		(a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
	);
}

export async function getFeaturedAlbums(limit = 4): Promise<AlbumEntry[]> {
	const albums = await getAlbumsSorted();
	return albums.filter((a) => a.data.featured).slice(0, limit);
}

export async function getAlbumBySlug(slug: string): Promise<AlbumEntry | undefined> {
	const albums = await getCollection('albums');
	return albums.find((a) => a.data.slug === slug);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryEntry | undefined> {
	const categories = await getCollection('categories');
	return categories.find((c) => c.data.slug === slug);
}

export async function getAlbumsByCategory(categorySlug: string): Promise<AlbumEntry[]> {
	const albums = await getAlbumsSorted();
	return albums.filter((a) => a.data.category === categorySlug);
}

export async function getPhotosForAlbum(albumSlug: string): Promise<PhotoEntry[]> {
	const photos = await getCollection('photos');
	const albumPhotos = photos.filter((p) => p.data.album === albumSlug);
	const album = await getAlbumBySlug(albumSlug);
	if (album?.data.photoOrder?.length) {
		const order = new Map(album.data.photoOrder.map((id, i) => [id, i]));
		albumPhotos.sort((a, b) => {
			const ai = order.get(a.data.id) ?? 999;
			const bi = order.get(b.data.id) ?? 999;
			return ai - bi;
		});
	} else {
		albumPhotos.sort(
			(a, b) => a.data.takenAt.getTime() - b.data.takenAt.getTime(),
		);
	}
	return albumPhotos;
}

export async function getPhotoById(id: string): Promise<PhotoEntry | undefined> {
	const photos = await getCollection('photos');
	return photos.find((p) => p.data.id === id);
}

export async function getFeaturedPhotos(limit = 8): Promise<PhotoEntry[]> {
	const photos = await getCollection('photos');
	return photos
		.filter((p) => p.data.featured)
		.sort((a, b) => b.data.takenAt.getTime() - a.data.takenAt.getTime())
		.slice(0, limit);
}

export type TagAggregate = {
	slug: string;
	zh: string;
	en: string;
	count: number;
};

export async function getAllTags(): Promise<TagAggregate[]> {
	const photos = await getCollection('photos');
	const map = new Map<string, TagAggregate>();
	for (const photo of photos) {
		for (const tag of photo.data.tags) {
			const existing = map.get(tag.slug);
			if (existing) {
				existing.count += 1;
			} else {
				map.set(tag.slug, { ...tag, count: 1 });
			}
		}
	}
	return [...map.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export async function getPhotosByTag(tagSlug: string): Promise<PhotoEntry[]> {
	const photos = await getCollection('photos');
	return photos
		.filter((p) => p.data.tags.some((t) => t.slug === tagSlug))
		.sort((a, b) => b.data.takenAt.getTime() - a.data.takenAt.getTime());
}

export function photoTitle(photo: PhotoEntry, lang: Lang): string {
	return localized(photo.data.title, lang);
}

export function albumTitle(album: AlbumEntry, lang: Lang): string {
	return localized(album.data.title, lang);
}

export function categoryTitle(category: CategoryEntry, lang: Lang): string {
	return localized(category.data.title, lang);
}
