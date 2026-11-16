import { DEFAULT_SAVED_SLUGS, findZoneBySlug } from '../domain/zone-catalog';

/**
 * Persistencia de las zonas guardadas en localStorage del navegador.
 * Emite el evento `zones:change` en window cada vez que cambian.
 */
const STORAGE_KEY = 'raiz-horaria:zones';
export const ZONES_CHANGE_EVENT = 'zones:change';

function write(slugs: string[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
	} catch {
		/* modo privado o almacenamiento bloqueado: seguimos en memoria */
	}
	memory = slugs;
	window.dispatchEvent(new CustomEvent<string[]>(ZONES_CHANGE_EVENT, { detail: slugs }));
}

let memory: string[] | null = null;

export function getSavedZones(): string[] {
	if (memory) return memory;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === null) {
			// Primera visita: sembramos unas zonas por defecto.
			memory = [...DEFAULT_SAVED_SLUGS];
			localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
			return memory;
		}
		const parsed: unknown = JSON.parse(raw);
		memory = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string' && Boolean(findZoneBySlug(s))) : [];
	} catch {
		memory = [...DEFAULT_SAVED_SLUGS];
	}
	return memory;
}

export function isZoneSaved(slug: string): boolean {
	return getSavedZones().includes(slug);
}

/** Devuelve false si la zona ya estaba guardada o no existe. */
export function addZone(slug: string): boolean {
	const current = getSavedZones();
	if (current.includes(slug) || !findZoneBySlug(slug)) return false;
	write([...current, slug]);
	return true;
}

export function removeZone(slug: string) {
	write(getSavedZones().filter((s) => s !== slug));
}

export function toggleZone(slug: string): boolean {
	if (isZoneSaved(slug)) {
		removeZone(slug);
		return false;
	}
	return addZone(slug);
}
