import type { DayPeriod } from './zone';

/**
 * Funciones puras de hora. Se usan tanto en el servidor (SSR) como en el
 * navegador (reloj que avanza cada segundo), por eso no dependen del DOM.
 */

export const LOCALE = 'es';

export function isValidTimeZone(timeZone: string): boolean {
	try {
		new Intl.DateTimeFormat('en-US', { timeZone });
		return true;
	} catch {
		return false;
	}
}

/** Desfase respecto a UTC en minutos (p. ej. Bogotá = -300). */
export function getOffsetMinutes(timeZone: string, date = new Date()): number {
	const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
		.formatToParts(date)
		.find((p) => p.type === 'timeZoneName')?.value;
	// "GMT", "GMT-05:00", "GMT+05:45"
	const match = part?.match(/GMT([+-])(\d{2}):?(\d{2})?/);
	if (!match) return 0;
	const sign = match[1] === '-' ? -1 : 1;
	return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/** "UTC−05:00" */
export function formatOffset(minutes: number): string {
	const sign = minutes < 0 ? '−' : '+';
	const abs = Math.abs(minutes);
	const h = String(Math.floor(abs / 60)).padStart(2, '0');
	const m = String(abs % 60).padStart(2, '0');
	return `UTC${sign}${h}:${m}`;
}

/** "+3 h", "−5 h 30 min", "misma hora" */
export function formatDifference(minutes: number): string {
	if (minutes === 0) return 'Misma hora';
	const sign = minutes < 0 ? '−' : '+';
	const abs = Math.abs(minutes);
	const h = Math.floor(abs / 60);
	const m = abs % 60;
	return `${sign}${h ? `${h} h` : ''}${h && m ? ' ' : ''}${m ? `${m} min` : ''}`;
}

export function formatTime(timeZone: string, date = new Date(), withSeconds = true): string {
	return new Intl.DateTimeFormat(LOCALE, {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		second: withSeconds ? '2-digit' : undefined,
		hourCycle: 'h23',
	}).format(date);
}

export function formatDate(timeZone: string, date = new Date()): string {
	const text = new Intl.DateTimeFormat(LOCALE, {
		timeZone,
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(date);
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatShortDate(timeZone: string, date = new Date()): string {
	return new Intl.DateTimeFormat(LOCALE, { timeZone, weekday: 'short', day: 'numeric', month: 'short' }).format(date);
}

/** Hora, minuto y segundo dentro de la zona. */
export function getClockParts(timeZone: string, date = new Date()): { h: number; m: number; s: number } {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hourCycle: 'h23',
	}).formatToParts(date);
	const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
	return { h: get('hour'), m: get('minute'), s: get('second') };
}

export function getDayPeriod(hour: number): DayPeriod {
	if (hour < 6) return 'dawn';
	if (hour < 12) return 'morning';
	if (hour < 19) return 'afternoon';
	return 'night';
}

/** ¿La zona está ahora mismo en horario de verano? */
export function isDaylightSaving(timeZone: string, date = new Date()): boolean {
	const year = date.getUTCFullYear();
	const jan = getOffsetMinutes(timeZone, new Date(Date.UTC(year, 0, 1)));
	const jul = getOffsetMinutes(timeZone, new Date(Date.UTC(year, 6, 1)));
	if (jan === jul) return false;
	return getOffsetMinutes(timeZone, date) === Math.max(jan, jul);
}

/** ¿La zona cambia de hora en algún momento del año? */
export function observesDaylightSaving(timeZone: string, date = new Date()): boolean {
	const year = date.getUTCFullYear();
	return getOffsetMinutes(timeZone, new Date(Date.UTC(year, 0, 1))) !== getOffsetMinutes(timeZone, new Date(Date.UTC(year, 6, 1)));
}

/** Nombre largo de la zona: "hora estándar de Colombia". */
export function timeZoneLongName(timeZone: string, date = new Date()): string {
	return (
		new Intl.DateTimeFormat(LOCALE, { timeZone, timeZoneName: 'long' }).formatToParts(date).find((p) => p.type === 'timeZoneName')
			?.value ?? timeZone
	);
}

/** "America/Argentina/Buenos_Aires" → "Buenos Aires" */
export function cityFromTimeZone(timeZone: string): string {
	return (timeZone.split('/').pop() ?? timeZone).replaceAll('_', ' ');
}

/** "2026-11-16T14" — fecha y hora local de la zona, útil para comparar con datos horarios del clima. */
export function localIsoHour(timeZone: string, date = new Date()): string {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		hourCycle: 'h23',
	}).formatToParts(date);
	const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
	return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}`;
}
