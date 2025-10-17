// src/utils/metrics.js
export function getBandStatus(value, { ok, warn }) {
	if (value >= ok[0] && value <= ok[1]) return { label: 'Óptimo', color: 'success' }
	if (value >= warn[0] && value <= warn[1]) return { label: 'Atento', color: 'warning' }
	return { label: 'Crítico', color: 'error' }
}

export function percent(value, min, max) {
	if (max === min) return 0
	const p = ((value - min) * 100) / (max - min)
	return Math.max(0, Math.min(100, p))
}

export const fmt = {
	int: (n) => Number(n).toFixed(0),
	one: (n) => Number(n).toFixed(1),
}
