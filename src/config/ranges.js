// src/config/ranges.js
export const defaultRanges = {
	ph: { ok: [5.5, 6.5], warn: [5.0, 7.0] },
	temperatureC: { ok: [20, 26], warn: [18, 28] },
	humidityPct: { ok: [50, 70], warn: [40, 80] },
	lightPct: { ok: [60, 90], warn: [40, 95] },
}
