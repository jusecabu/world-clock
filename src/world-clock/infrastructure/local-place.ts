import type { AstroCookies } from 'astro';
import type { Place, Zone } from '../domain/zone';
import { findZoneByTimeZone } from '../domain/zone-catalog';
import { cityFromTimeZone, isValidTimeZone } from '../domain/time';

import { LOCAL_TZ_COOKIE } from './cookie-names';

export const FALLBACK_TIME_ZONE = 'UTC';

export interface LocalPlace extends Place {
	/** Si la zona coincide con una del catálogo, enlazamos a su detalle. */
	zone?: Zone;
	/** false si aún no conocemos la zona real del visitante (primera visita). */
	known: boolean;
}

export function readLocalTimeZone(cookies: AstroCookies): string | undefined {
	const value = cookies.get(LOCAL_TZ_COOKIE)?.value;
	return value && isValidTimeZone(value) ? value : undefined;
}

const geocodeCache = new Map<string, Promise<Place | undefined>>();

/** Busca coordenadas para una zona que no está en el catálogo (Open-Meteo Geocoding, sin API key). */
function geocodeTimeZone(timeZone: string): Promise<Place | undefined> {
	const cached = geocodeCache.get(timeZone);
	if (cached) return cached;

	const city = cityFromTimeZone(timeZone);
	const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
	url.searchParams.set('name', city);
	url.searchParams.set('count', '5');
	url.searchParams.set('language', 'es');

	const request = fetch(url, { signal: AbortSignal.timeout(4000) })
		.then((r) => (r.ok ? r.json() : undefined))
		.then((data: { results?: Array<{ name: string; country?: string; country_code?: string; latitude: number; longitude: number; timezone?: string }> } | undefined) => {
			const results = data?.results ?? [];
			const hit = results.find((r) => r.timezone === timeZone) ?? results[0];
			if (!hit) return undefined;
			return {
				city: hit.name,
				country: hit.country ?? '',
				countryCode: hit.country_code ?? '',
				timeZone,
				latitude: hit.latitude,
				longitude: hit.longitude,
			} satisfies Place;
		})
		.catch(() => undefined);

	geocodeCache.set(timeZone, request);
	return request;
}

export async function resolveLocalPlace(timeZone: string | undefined): Promise<LocalPlace> {
	if (!timeZone) {
		return { city: 'Tu ubicación', country: '', countryCode: '', timeZone: FALLBACK_TIME_ZONE, latitude: 0, longitude: 0, known: false };
	}
	const zone = findZoneByTimeZone(timeZone);
	if (zone) return { ...zone, zone, known: true };

	const place = await geocodeTimeZone(timeZone);
	return (
		(place && { ...place, known: true }) ?? {
			city: cityFromTimeZone(timeZone),
			country: '',
			countryCode: '',
			timeZone,
			latitude: NaN,
			longitude: NaN,
			known: true,
		}
	);
}
