/** Tipo de icono que dibuja el átomo WeatherIcon. */
export type WeatherIconKind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

export interface WeatherCondition {
	label: string;
	icon: WeatherIconKind;
}

export interface CurrentWeather {
	temperature: number;
	apparentTemperature: number;
	humidity: number;
	windSpeed: number;
	weatherCode: number;
	isDay: boolean;
}

export interface DailyForecast {
	/** Fecha local de la zona: "2026-11-16" */
	date: string;
	weatherCode: number;
	max: number;
	min: number;
	precipitationProbability: number | null;
	sunrise: string;
	sunset: string;
}

export interface HourlyForecast {
	/** Hora local de la zona: "2026-11-16T14:00" */
	time: string;
	temperature: number;
	weatherCode: number;
	isDay: boolean;
}

export interface WeatherReport {
	current: CurrentWeather;
	daily: DailyForecast[];
	hourly: HourlyForecast[];
	fetchedAt: number;
}

/** Códigos WMO usados por Open-Meteo → etiqueta en español + icono. */
const CONDITIONS: Record<number, WeatherCondition> = {
	0: { label: 'Despejado', icon: 'clear' },
	1: { label: 'Mayormente despejado', icon: 'partly' },
	2: { label: 'Parcialmente nublado', icon: 'partly' },
	3: { label: 'Nublado', icon: 'cloudy' },
	45: { label: 'Niebla', icon: 'fog' },
	48: { label: 'Niebla con escarcha', icon: 'fog' },
	51: { label: 'Llovizna ligera', icon: 'drizzle' },
	53: { label: 'Llovizna', icon: 'drizzle' },
	55: { label: 'Llovizna intensa', icon: 'drizzle' },
	56: { label: 'Llovizna helada', icon: 'drizzle' },
	57: { label: 'Llovizna helada intensa', icon: 'drizzle' },
	61: { label: 'Lluvia ligera', icon: 'rain' },
	63: { label: 'Lluvia', icon: 'rain' },
	65: { label: 'Lluvia fuerte', icon: 'rain' },
	66: { label: 'Lluvia helada', icon: 'rain' },
	67: { label: 'Lluvia helada fuerte', icon: 'rain' },
	71: { label: 'Nevada ligera', icon: 'snow' },
	73: { label: 'Nevada', icon: 'snow' },
	75: { label: 'Nevada fuerte', icon: 'snow' },
	77: { label: 'Granizo fino', icon: 'snow' },
	80: { label: 'Chubascos ligeros', icon: 'rain' },
	81: { label: 'Chubascos', icon: 'rain' },
	82: { label: 'Chubascos violentos', icon: 'rain' },
	85: { label: 'Chubascos de nieve', icon: 'snow' },
	86: { label: 'Chubascos de nieve fuertes', icon: 'snow' },
	95: { label: 'Tormenta', icon: 'storm' },
	96: { label: 'Tormenta con granizo', icon: 'storm' },
	99: { label: 'Tormenta fuerte con granizo', icon: 'storm' },
};

export function describeWeather(code: number): WeatherCondition {
	return CONDITIONS[code] ?? { label: 'Sin datos', icon: 'cloudy' };
}

export function formatTemperature(value: number): string {
	return `${Math.round(value)}°`;
}
