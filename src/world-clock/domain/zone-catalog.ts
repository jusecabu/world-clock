import type { Region, Zone } from './zone';

type Row = [slug: string, city: string, country: string, cc: string, tz: string, lat: number, lon: number, region: Region];

const rows: Row[] = [
	// América
	['bogota', 'Bogotá', 'Colombia', 'CO', 'America/Bogota', 4.711, -74.0721, 'América'],
	['medellin', 'Medellín', 'Colombia', 'CO', 'America/Bogota', 6.2442, -75.5812, 'América'],
	['ciudad-de-mexico', 'Ciudad de México', 'México', 'MX', 'America/Mexico_City', 19.4326, -99.1332, 'América'],
	['lima', 'Lima', 'Perú', 'PE', 'America/Lima', -12.0464, -77.0428, 'América'],
	['quito', 'Quito', 'Ecuador', 'EC', 'America/Guayaquil', -0.1807, -78.4678, 'América'],
	['caracas', 'Caracas', 'Venezuela', 'VE', 'America/Caracas', 10.4806, -66.9036, 'América'],
	['santiago', 'Santiago', 'Chile', 'CL', 'America/Santiago', -33.4489, -70.6693, 'América'],
	['buenos-aires', 'Buenos Aires', 'Argentina', 'AR', 'America/Argentina/Buenos_Aires', -34.6037, -58.3816, 'América'],
	['montevideo', 'Montevideo', 'Uruguay', 'UY', 'America/Montevideo', -34.9011, -56.1645, 'América'],
	['sao-paulo', 'São Paulo', 'Brasil', 'BR', 'America/Sao_Paulo', -23.5505, -46.6333, 'América'],
	['la-paz', 'La Paz', 'Bolivia', 'BO', 'America/La_Paz', -16.4897, -68.1193, 'América'],
	['asuncion', 'Asunción', 'Paraguay', 'PY', 'America/Asuncion', -25.2637, -57.5759, 'América'],
	['panama', 'Ciudad de Panamá', 'Panamá', 'PA', 'America/Panama', 8.9824, -79.5199, 'América'],
	['san-jose', 'San José', 'Costa Rica', 'CR', 'America/Costa_Rica', 9.9281, -84.0907, 'América'],
	['guatemala', 'Ciudad de Guatemala', 'Guatemala', 'GT', 'America/Guatemala', 14.6349, -90.5069, 'América'],
	['la-habana', 'La Habana', 'Cuba', 'CU', 'America/Havana', 23.1136, -82.3666, 'América'],
	['santo-domingo', 'Santo Domingo', 'República Dominicana', 'DO', 'America/Santo_Domingo', 18.4861, -69.9312, 'América'],
	['san-juan', 'San Juan', 'Puerto Rico', 'PR', 'America/Puerto_Rico', 18.4655, -66.1057, 'América'],
	['nueva-york', 'Nueva York', 'Estados Unidos', 'US', 'America/New_York', 40.7128, -74.006, 'América'],
	['miami', 'Miami', 'Estados Unidos', 'US', 'America/New_York', 25.7617, -80.1918, 'América'],
	['chicago', 'Chicago', 'Estados Unidos', 'US', 'America/Chicago', 41.8781, -87.6298, 'América'],
	['denver', 'Denver', 'Estados Unidos', 'US', 'America/Denver', 39.7392, -104.9903, 'América'],
	['los-angeles', 'Los Ángeles', 'Estados Unidos', 'US', 'America/Los_Angeles', 34.0522, -118.2437, 'América'],
	['anchorage', 'Anchorage', 'Estados Unidos', 'US', 'America/Anchorage', 61.2181, -149.9003, 'América'],
	['honolulu', 'Honolulu', 'Estados Unidos', 'US', 'Pacific/Honolulu', 21.3069, -157.8583, 'Oceanía'],
	['toronto', 'Toronto', 'Canadá', 'CA', 'America/Toronto', 43.6532, -79.3832, 'América'],
	['vancouver', 'Vancouver', 'Canadá', 'CA', 'America/Vancouver', 49.2827, -123.1207, 'América'],
	// Europa
	['madrid', 'Madrid', 'España', 'ES', 'Europe/Madrid', 40.4168, -3.7038, 'Europa'],
	['barcelona', 'Barcelona', 'España', 'ES', 'Europe/Madrid', 41.3874, 2.1686, 'Europa'],
	['canarias', 'Las Palmas', 'España', 'ES', 'Atlantic/Canary', 28.1235, -15.4363, 'Europa'],
	['lisboa', 'Lisboa', 'Portugal', 'PT', 'Europe/Lisbon', 38.7223, -9.1393, 'Europa'],
	['londres', 'Londres', 'Reino Unido', 'GB', 'Europe/London', 51.5072, -0.1276, 'Europa'],
	['dublin', 'Dublín', 'Irlanda', 'IE', 'Europe/Dublin', 53.3498, -6.2603, 'Europa'],
	['paris', 'París', 'Francia', 'FR', 'Europe/Paris', 48.8566, 2.3522, 'Europa'],
	['berlin', 'Berlín', 'Alemania', 'DE', 'Europe/Berlin', 52.52, 13.405, 'Europa'],
	['roma', 'Roma', 'Italia', 'IT', 'Europe/Rome', 41.9028, 12.4964, 'Europa'],
	['amsterdam', 'Ámsterdam', 'Países Bajos', 'NL', 'Europe/Amsterdam', 52.3676, 4.9041, 'Europa'],
	['estocolmo', 'Estocolmo', 'Suecia', 'SE', 'Europe/Stockholm', 59.3293, 18.0686, 'Europa'],
	['atenas', 'Atenas', 'Grecia', 'GR', 'Europe/Athens', 37.9838, 23.7275, 'Europa'],
	['estambul', 'Estambul', 'Turquía', 'TR', 'Europe/Istanbul', 41.0082, 28.9784, 'Europa'],
	['moscu', 'Moscú', 'Rusia', 'RU', 'Europe/Moscow', 55.7558, 37.6173, 'Europa'],
	['reikiavik', 'Reikiavik', 'Islandia', 'IS', 'Atlantic/Reykjavik', 64.1466, -21.9426, 'Europa'],
	// África
	['el-cairo', 'El Cairo', 'Egipto', 'EG', 'Africa/Cairo', 30.0444, 31.2357, 'África'],
	['lagos', 'Lagos', 'Nigeria', 'NG', 'Africa/Lagos', 6.5244, 3.3792, 'África'],
	['nairobi', 'Nairobi', 'Kenia', 'KE', 'Africa/Nairobi', -1.2921, 36.8219, 'África'],
	['ciudad-del-cabo', 'Ciudad del Cabo', 'Sudáfrica', 'ZA', 'Africa/Johannesburg', -33.9249, 18.4241, 'África'],
	['casablanca', 'Casablanca', 'Marruecos', 'MA', 'Africa/Casablanca', 33.5731, -7.5898, 'África'],
	// Asia
	['dubai', 'Dubái', 'Emiratos Árabes Unidos', 'AE', 'Asia/Dubai', 25.2048, 55.2708, 'Asia'],
	['teheran', 'Teherán', 'Irán', 'IR', 'Asia/Tehran', 35.6892, 51.389, 'Asia'],
	['nueva-delhi', 'Nueva Delhi', 'India', 'IN', 'Asia/Kolkata', 28.6139, 77.209, 'Asia'],
	['katmandu', 'Katmandú', 'Nepal', 'NP', 'Asia/Kathmandu', 27.7172, 85.324, 'Asia'],
	['bangkok', 'Bangkok', 'Tailandia', 'TH', 'Asia/Bangkok', 13.7563, 100.5018, 'Asia'],
	['singapur', 'Singapur', 'Singapur', 'SG', 'Asia/Singapore', 1.3521, 103.8198, 'Asia'],
	['hong-kong', 'Hong Kong', 'China', 'HK', 'Asia/Hong_Kong', 22.3193, 114.1694, 'Asia'],
	['shanghai', 'Shanghái', 'China', 'CN', 'Asia/Shanghai', 31.2304, 121.4737, 'Asia'],
	['manila', 'Manila', 'Filipinas', 'PH', 'Asia/Manila', 14.5995, 120.9842, 'Asia'],
	['seul', 'Seúl', 'Corea del Sur', 'KR', 'Asia/Seoul', 37.5665, 126.978, 'Asia'],
	['tokio', 'Tokio', 'Japón', 'JP', 'Asia/Tokyo', 35.6762, 139.6503, 'Asia'],
	// Oceanía
	['sidney', 'Sídney', 'Australia', 'AU', 'Australia/Sydney', -33.8688, 151.2093, 'Oceanía'],
	['perth', 'Perth', 'Australia', 'AU', 'Australia/Perth', -31.9505, 115.8605, 'Oceanía'],
	['auckland', 'Auckland', 'Nueva Zelanda', 'NZ', 'Pacific/Auckland', -36.8509, 174.7645, 'Oceanía'],
];

export const ZONES: readonly Zone[] = rows.map(([slug, city, country, countryCode, timeZone, latitude, longitude, region]) => ({
	slug,
	city,
	country,
	countryCode,
	timeZone,
	latitude,
	longitude,
	region,
}));

const bySlug = new Map(ZONES.map((z) => [z.slug, z]));

export const REGIONS: readonly Region[] = ['América', 'Europa', 'África', 'Asia', 'Oceanía'];

/** Zonas que se añaden automáticamente la primera vez que alguien visita la app. */
export const DEFAULT_SAVED_SLUGS = ['madrid', 'nueva-york', 'tokio'];

/** Zonas destacadas en la portada (enlazado interno para SEO). */
export const FEATURED_SLUGS = ['bogota', 'ciudad-de-mexico', 'buenos-aires', 'madrid', 'londres', 'nueva-york', 'los-angeles', 'tokio', 'sidney', 'dubai'];

export function findZoneBySlug(slug: string | undefined): Zone | undefined {
	return slug ? bySlug.get(slug) : undefined;
}

export function findZoneByTimeZone(timeZone: string): Zone | undefined {
	return ZONES.find((z) => z.timeZone === timeZone);
}

export function zonesBySlugs(slugs: string[]): Zone[] {
	return slugs.map((s) => bySlug.get(s)).filter((z): z is Zone => Boolean(z));
}

export function zonesByRegion(): Map<Region, Zone[]> {
	const map = new Map<Region, Zone[]>(REGIONS.map((r) => [r, []]));
	for (const z of ZONES) map.get(z.region)!.push(z);
	for (const list of map.values()) list.sort((a, b) => a.city.localeCompare(b.city, 'es'));
	return map;
}

/** Texto usado en el buscador de "añadir zona". */
export function zoneSearchLabel(z: Zone): string {
	return `${z.city}, ${z.country}`;
}
