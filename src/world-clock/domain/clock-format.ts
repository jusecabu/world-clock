import { formatDate, formatDifference, formatOffset, formatShortDate, formatTime, getClockParts, getDayPeriod, getOffsetMinutes } from './time';
import { DAY_PERIOD_LABEL } from './zone';

/** Formatos que entiende el átomo LiveTime y el reloj del navegador. */
export type ClockFormat = 'time' | 'time-short' | 'date' | 'date-short' | 'offset' | 'diff' | 'period';

/**
 * Texto de un reloj en un formato dado. Misma función en servidor (SSR) y cliente,
 * así el HTML inicial y el que se actualiza cada segundo son idénticos.
 */
export function formatClock(format: ClockFormat, timeZone: string, now: Date, localTimeZone?: string): string {
	switch (format) {
		case 'time':
			return formatTime(timeZone, now, true);
		case 'time-short':
			return formatTime(timeZone, now, false);
		case 'date':
			return formatDate(timeZone, now);
		case 'date-short':
			return formatShortDate(timeZone, now);
		case 'offset':
			return formatOffset(getOffsetMinutes(timeZone, now));
		case 'diff': {
			if (!localTimeZone) return 'Comparando…';
			const diff = getOffsetMinutes(timeZone, now) - getOffsetMinutes(localTimeZone, now);
			return diff === 0 ? 'Misma hora que tú' : `${formatDifference(diff)} vs. tú`;
		}
		case 'period':
			return DAY_PERIOD_LABEL[getDayPeriod(getClockParts(timeZone, now).h)];
	}
}
