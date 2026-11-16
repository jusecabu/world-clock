import type { SitemapOptions, SitemapItem } from '@astrojs/sitemap';
import { ZONES } from '../../world-clock/domain/zone-catalog';

/**
 * Opciones para la integración oficial @astrojs/sitemap (se usan en astro.config.mjs).
 *
 * En modo SSR la integración solo descubre las rutas sin parámetros (/, /zonas).
 * Las páginas dinámicas /zona/[slug] se generan en cada petición, así que las
 * añadimos a mano desde el catálogo de zonas con `customPages`.
 */
export function sitemapOptions(site: string): SitemapOptions {
	return {
		customPages: ZONES.map((z) => new URL(`/zona/${z.slug}`, site).href),
		filter: (page) => !page.includes('/partials/') && !page.endsWith('/404'),
		lastmod: new Date(),
		serialize(item): SitemapItem {
			const { pathname } = new URL(item.url);
			if (pathname === '/') return { ...item, changefreq: 'always' as SitemapItem['changefreq'], priority: 1 };
			if (pathname.startsWith('/zona/')) return { ...item, changefreq: 'hourly' as SitemapItem['changefreq'], priority: 0.7 };
			return { ...item, changefreq: 'daily' as SitemapItem['changefreq'], priority: 0.8 };
		},
	};
}
