// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { sitemapOptions } from './src/seo/domain/sitemap';

// URL pública del sitio: necesaria para canonical, Open Graph y sitemap.
// Defínela en producción con la variable de entorno SITE_URL.
const site = process.env.SITE_URL ?? 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
	site,
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	trailingSlash: 'never',

	integrations: [sitemap(sitemapOptions(site))],

	// Prefetch nativo: precarga las páginas de detalle al pasar el ratón por los enlaces.
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},

	// Fonts API nativa: Astro descarga y sirve las fuentes desde el propio sitio
	// (sin peticiones a Google en el navegador) y genera fallbacks ajustados.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Space Grotesk',
			cssVariable: '--font-space-grotesk',
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Space Mono',
			cssVariable: '--font-space-mono',
			weights: [400, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
});
