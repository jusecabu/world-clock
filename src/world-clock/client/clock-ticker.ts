import { getClockParts, getDayPeriod } from '../domain/time';
import { formatClock, type ClockFormat } from '../domain/clock-format';
import { browserTimeZone } from './browser-time-zone';

/**
 * Reloj del navegador: cada segundo actualiza todos los elementos marcados en el HTML
 * renderizado por el servidor. Trabaja sobre atributos, así sirve también para el
 * HTML que se inserta después (parciales):
 *
 *  [data-clock="time|time-short|date|date-short|offset|diff|period"][data-tz]
 *  [data-analog][data-tz]        → variables CSS --h, --m, --s para las agujas
 *  [data-period-tz]              → atributo data-period (colorea tarjetas según la hora)
 *
 * data-tz="local" significa "la zona horaria de este navegador".
 */

const resolve = (tz: string | undefined, localTz: string) => (!tz || tz === 'local' ? localTz : tz);

function tick(localTz: string) {
	const now = new Date();

	document.querySelectorAll<HTMLElement>('[data-clock][data-tz]').forEach((el) => {
		const text = formatClock(el.dataset.clock as ClockFormat, resolve(el.dataset.tz, localTz), now, localTz);
		if (el.textContent !== text) el.textContent = text;
	});

	document.querySelectorAll<HTMLElement>('[data-analog][data-tz]').forEach((el) => {
		const { h, m, s } = getClockParts(resolve(el.dataset.tz, localTz), now);
		el.style.setProperty('--s', String(s));
		el.style.setProperty('--m', String(m + s / 60));
		el.style.setProperty('--h', String((h % 12) + m / 60));
	});

	document.querySelectorAll<HTMLElement>('[data-period-tz]').forEach((el) => {
		const period = getDayPeriod(getClockParts(resolve(el.dataset.periodTz, localTz), now).h);
		if (el.dataset.period !== period) el.dataset.period = period;
	});
}

let started = false;

/** Arranca el reloj (idempotente). Se alinea al cambio de segundo para que todos los relojes salten a la vez. */
export function startClocks() {
	if (started) return;
	started = true;
	const localTz = browserTimeZone();
	const loop = () => {
		tick(localTz);
		setTimeout(loop, 1000 - (Date.now() % 1000) + 5);
	};
	loop();
}

/** Fuerza un repintado inmediato, p. ej. tras insertar HTML nuevo. */
export function refreshClocks() {
	tick(browserTimeZone());
}
