import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site, url }) => {
	const base = site ?? new URL(url.origin);
	const body = ['User-agent: *', 'Allow: /', 'Disallow: /partials/', '', `Sitemap: ${new URL('/sitemap-index.xml', base).href}`, ''].join('\n');
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
	});
};
