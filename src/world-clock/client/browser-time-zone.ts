import { LOCAL_TZ_COOKIE } from '../infrastructure/cookie-names';

export function browserTimeZone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

/**
 * Guarda la zona horaria del navegador en una cookie para que el servidor
 * pueda renderizar la hora local en la próxima petición (SSR).
 * Devuelve true si la cookie no existía o era distinta.
 */
export function syncTimeZoneCookie(): boolean {
	const tz = browserTimeZone();
	const current = document.cookie
		.split('; ')
		.find((c) => c.startsWith(`${LOCAL_TZ_COOKIE}=`))
		?.split('=')[1];
	if (current && decodeURIComponent(current) === tz) return false;
	document.cookie = `${LOCAL_TZ_COOKIE}=${encodeURIComponent(tz)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
	return true;
}
