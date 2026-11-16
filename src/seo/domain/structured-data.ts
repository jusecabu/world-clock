import type { Zone } from '@world-clock/domain/zone';
import { SITE } from './site';

/** Builders de datos estructurados (schema.org) para que Google entienda la app. */

export function webApplicationSchema(siteUrl: URL) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: SITE.name,
		url: siteUrl.href,
		description: SITE.description,
		applicationCategory: 'UtilitiesApplication',
		operatingSystem: 'Web',
		inLanguage: SITE.lang,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
	};
}

export function webSiteSchema(siteUrl: URL) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE.name,
		url: siteUrl.href,
		inLanguage: SITE.lang,
	};
}

export function breadcrumbSchema(items: Array<{ name: string; url: URL }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url.href,
		})),
	};
}

export function placeSchema(zone: Zone, pageUrl: URL) {
	return {
		'@context': 'https://schema.org',
		'@type': 'City',
		name: zone.city,
		url: pageUrl.href,
		containedInPlace: { '@type': 'Country', name: zone.country },
		geo: { '@type': 'GeoCoordinates', latitude: zone.latitude, longitude: zone.longitude },
	};
}

export function faqSchema(entries: Array<{ question: string; answer: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: entries.map((e) => ({
			'@type': 'Question',
			name: e.question,
			acceptedAnswer: { '@type': 'Answer', text: e.answer },
		})),
	};
}
