import type { WeatherReport } from '../domain/weather';

/**
 * Cliente de Open-Meteo (gratis, sin API key). Se ejecuta solo en el servidor
 * y cachea en memoria para no repetir peticiones en cada render SSR.
 */
const TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { expires: number; value: Promise<WeatherReport | null> }>();

interface OpenMeteoResponse {
	current: {
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
		weather_code: number;
		is_day: number;
	};
	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		precipitation_probability_max: (number | null)[];
		sunrise: string[];
		sunset: string[];
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		weather_code: number[];
		is_day: number[];
	};
}

async function request(latitude: number, longitude: number, timeZone: string): Promise<WeatherReport | null> {
	const url = new URL('https://api.open-meteo.com/v1/forecast');
	url.searchParams.set('latitude', latitude.toFixed(4));
	url.searchParams.set('longitude', longitude.toFixed(4));
	url.searchParams.set('timezone', timeZone);
	url.searchParams.set('forecast_days', '7');
	url.searchParams.set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day');
	url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset');
	url.searchParams.set('hourly', 'temperature_2m,weather_code,is_day');

	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
		if (!res.ok) return null;
		const data = (await res.json()) as OpenMeteoResponse;
		return {
			fetchedAt: Date.now(),
			current: {
				temperature: data.current.temperature_2m,
				apparentTemperature: data.current.apparent_temperature,
				humidity: data.current.relative_humidity_2m,
				windSpeed: data.current.wind_speed_10m,
				weatherCode: data.current.weather_code,
				isDay: data.current.is_day === 1,
			},
			daily: data.daily.time.map((date, i) => ({
				date,
				weatherCode: data.daily.weather_code[i],
				max: data.daily.temperature_2m_max[i],
				min: data.daily.temperature_2m_min[i],
				precipitationProbability: data.daily.precipitation_probability_max[i] ?? null,
				sunrise: data.daily.sunrise[i],
				sunset: data.daily.sunset[i],
			})),
			hourly: data.hourly.time.map((time, i) => ({
				time,
				temperature: data.hourly.temperature_2m[i],
				weatherCode: data.hourly.weather_code[i],
				isDay: data.hourly.is_day[i] === 1,
			})),
		};
	} catch {
		return null;
	}
}

/** Devuelve el pronóstico o `null` si la API no responde (la UI muestra un estado vacío). */
export function getWeather(place: { latitude: number; longitude: number; timeZone: string }): Promise<WeatherReport | null> {
	if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) return Promise.resolve(null);

	const key = `${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}`;
	const hit = cache.get(key);
	if (hit && hit.expires > Date.now()) return hit.value;

	const value = request(place.latitude, place.longitude, place.timeZone).then((report) => {
		// No cachear fallos durante 10 minutos: reintentar pronto.
		if (!report) cache.delete(key);
		return report;
	});
	cache.set(key, { expires: Date.now() + TTL_MS, value });
	return value;
}

/** Las próximas `count` horas a partir de la hora local actual de la zona. */
export function upcomingHours(report: WeatherReport, nowLocalIso: string, count = 24) {
	const start = report.hourly.findIndex((h) => h.time >= nowLocalIso.slice(0, 13));
	return report.hourly.slice(Math.max(start, 0), Math.max(start, 0) + count);
}
