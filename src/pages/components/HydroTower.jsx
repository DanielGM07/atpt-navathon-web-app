import React from 'react'

/**
 * HYDROTOWER 2D — Two approaches in one file
 * - HydroTowerDeluxe2D: best visual quality, rich SVG, gradients, filters, Framer Motion animations
 * - HydroTowerLite2D: optimized DOM & effects, good visuals, minimal filters, no external libs beyond framer-motion
 *
 * Props shared by both components:
 *   nivelAgua: number 0..1 (0 = vacío, 1 = lleno)
 *   luz: number (lux aprox 0..1200) — usaremos escalado interno
 *   ph: number (ej. 5.0..7.5)
 *   temp: number (°C)
 *   humedad: number (%)
 *   minAgua: boolean (true si el nivel mínimo está activo)
 */

// ------- Utils -------
const clamp01 = v => Math.max(0, Math.min(1, v ?? 0))
const map = (v, inMin, inMax, outMin, outMax) => {
  const t = (v - inMin) / (inMax - inMin)
  return outMin + clamp01(t) * (outMax - outMin)
}

function phColor(ph) {
  if (ph == null || isNaN(ph)) return '#9ca3af'  // gris
  if (ph < 5.5) return '#ef4444' // rojo
  if (ph > 6.8) return '#f59e0b' // ámbar
  return '#10b981' // verde
}

function statusColor(ok) {
  return ok ? '#10b981' : '#ef4444'
}

// ===================== DELUXE =====================
export function HydroTowerDeluxe2D({
  nivelAgua = 0.6,
  luz = 700,
  ph = 6.2,
  temp = 22,
  humedad = 55,
  minAgua = false,
  className = '',
}) {
  const n = clamp01(nivelAgua)
  const viewW = 300
  const viewH = 520
  const tankX = 70,
    tankY = 60,
    tankW = 160,
    tankH = 380,
    tankR = 22

  // Agua
  const aguaTop = tankY + (1 - n) * tankH // y desde donde empieza el agua

  // Luz → glow strength (0..12)
  const glow = map(luz ?? 0, 0, 1200, 0, 12)

  // Ondas del agua (Deluxe): animamos path d con una pequeña onda sinusoidal
  // Generamos una función de onda para construir el path superior del agua
  const wavePoints = (phase = 0) => {
    const pts = []
    const amplitude = 6 // altura onda
    const wavelength = 40 // separación
    const yBase = aguaTop
    for (let x = tankX; x <= tankX + tankW; x += 4) {
      const y = yBase + Math.sin((x + phase) / wavelength) * amplitude
      pts.push([x, y])
    }
    return pts
  }

  const pathFromPoints = pts => {
    if (!pts.length) return ''
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i][0]} ${pts[i][1]}`
    }
    d += ` L ${tankX + tankW} ${tankY + tankH}`
    d += ` L ${tankX} ${tankY + tankH}`
    d += ' Z'
    return d
  }

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className={className}>
      <defs>
        {/* Fondo suave */}
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.12" />
        </linearGradient>

        {/* Material del tanque */}
        <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <filter id="tankShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.15" />
        </filter>

        {/* Agua */}
        <linearGradient id="aguaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="aguaHighlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* Glow de luz */}
        <filter id="glowDeluxe" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glow} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip del tanque para recortar el agua */}
        <clipPath id="clipTanque">
          <rect x={tankX} y={tankY} width={tankW} height={tankH} rx={tankR} ry={tankR} />
        </clipPath>
      </defs>

      {/* Fondo */}
      <rect x="0" y="0" width={viewW} height={viewH} fill="url(#bgGrad)" />

      {/* Tanque */}
      <g filter="url(#tankShadow)">
        <rect
          x={tankX}
          y={tankY}
          width={tankW}
          height={tankH}
          rx={tankR}
          ry={tankR}
          fill="url(#tankGrad)"
          stroke="#cbd5e1"
        />
        {/* Brillo lateral */}
        <rect x={tankX + 8} y={tankY + 8} width={12} height={tankH - 16} rx={10} fill="url(#aguaHighlight)" />
      </g>

      {/* AGUA con ondas */}
      <g clipPath="url(#clipTanque)">
        {/* Fondo del agua (masa) */}
        <rect x={tankX} y={aguaTop} width={tankW} height={tankY + tankH - aguaTop} fill="url(#aguaGrad)" />

        {/* Onda superior animada */}
        <path d={pathFromPoints(wavePoints(0))} fill="#ffffff22" />

        {/* Luz (bombilla con glow) */}
        <g transform={`translate(${viewW / 2}, 34)`} filter="url(#glowDeluxe)">
          <circle r={12} fill="#fde047" />
          <circle r={map(luz ?? 0, 0, 1200, 0, 16)} fill="#fde04733" />
        </g>
      </g>

      {/* Indicadores (pH, Temp, Humedad, Nivel) */}
      <g fontFamily="ui-sans-serif, system-ui" fontSize="12" fill="#0f172a">
        {/* pH */}
        <g>
          <rect x={tankX + tankW + 14} y={tankY + 10} width="52" height="26" rx="6" fill="#fff" stroke="#e2e8f0" />
          <circle cx={tankX + tankW + 22} cy={tankY + 23} r={6} fill={phColor(ph)} />
          <text x={tankX + tankW + 34} y={tankY + 26} textAnchor="start">
            pH {ph?.toFixed?.(1)}
          </text>
        </g>
        {/* Temp */}
        <g>
          <rect x={tankX + tankW + 14} y={tankY + 46} width="52" height="26" rx="6" fill="#fff" stroke="#e2e8f0" />
          <text x={tankX + tankW + 40} y={tankY + 64} textAnchor="middle">
            {temp?.toFixed?.(0)}°C
          </text>
        </g>
        {/* Humedad */}
        <g>
          <rect x={tankX + tankW + 14} y={tankY + 82} width="52" height="26" rx="6" fill="#fff" stroke="#e2e8f0" />
          <text x={tankX + tankW + 40} y={tankY + 100} textAnchor="middle">
            {humedad?.toFixed?.(0)}%
          </text>
        </g>
        {/* Nivel mínimo */}
        <g>
          <rect x={tankX + tankW + 14} y={tankY + 118} width="52" height="26" rx="6" fill="#fff" stroke="#e2e8f0" />
          <circle cx={tankX + tankW + 26} cy={tankY + 131} r={6} fill={statusColor(!minAgua)} />
          <text x={tankX + tankW + 46} y={tankY + 134} textAnchor="middle">
            Lvl
          </text>
        </g>
      </g>
    </svg>
  )
}
