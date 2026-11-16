/** Un lugar del mundo con su zona horaria IANA y coordenadas (para pedir el clima). */
export interface Place {
	city: string;
	country: string;
	countryCode: string;
	/** Zona horaria IANA, p. ej. "America/Bogota" */
	timeZone: string;
	latitude: number;
	longitude: number;
}

/** Una zona del catálogo de la app; tiene página de detalle en /zona/{slug}. */
export interface Zone extends Place {
	slug: string;
	region: Region;
}

export type Region = 'América' | 'Europa' | 'África' | 'Asia' | 'Oceanía';

/** Momento del día; se usa para colorear las tarjetas. */
export type DayPeriod = 'dawn' | 'morning' | 'afternoon' | 'night';

export const DAY_PERIOD_LABEL: Record<DayPeriod, string> = {
	dawn: 'Madrugada',
	morning: 'Mañana',
	afternoon: 'Tarde',
	night: 'Noche',
};
