// src/pages/TowerHistory.jsx
import React from 'react'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { useTheme, alpha as muiAlpha } from '@mui/material/styles'

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import streamingPlugin from 'chartjs-plugin-streaming'

// Registrar componentes de Chart.js v3
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  streamingPlugin
)

const WINDOW_MS = 10 * 60 * 1000 // 10 minutos
const TICK_PRESETS = {
  '1s':  { label: '1 s',  ms: 1000 },
  '5s':  { label: '5 s',  ms: 5000 },
  '10s': { label: '10 s', ms: 10000 },
}

// Utilidades de simulación
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const rnd = (amp = 1) => (Math.random() - 0.5) * amp * 2
const nextValue = (prev, target, jitter, min, max, toFixed) => {
  const drift = (target - prev) * 0.06
  const v = clamp(prev + drift + rnd(jitter), min, max)
  return toFixed != null ? +v.toFixed(toFixed) : v
}

export default function TowerHistoryPage() {
  const theme = useTheme()
  const canvasRef = React.useRef(null)
  const chartRef = React.useRef/** @type {React.MutableRefObject<Chart|null>} */(null)

  const [tickKey, setTickKey] = React.useState('5s')

  // Estado interno del generador (no causa re-render)
  const genRef = React.useRef({
    ph: 6.2,
    temp: 22,
    hum: 60,
    light: 70,
  })

  // Paleta dependiente del tema (claro/oscuro)
  const colors = React.useMemo(() => {
    const p = theme.palette
    return {
      ph:    { border: p.primary.main,  bg: muiAlpha(p.primary.main, 0.12) },
      temp:  { border: p.error.main,    bg: muiAlpha(p.error.main,   0.12) },
      hum:   { border: p.info.main,     bg: muiAlpha(p.info.main,    0.12) },
      light: { border: p.success.main,  bg: muiAlpha(p.success.main, 0.12) },
      grid:  p.divider,
      text:  p.text.secondary,
    }
  }, [theme])

  // Crear chart una vez (y rehacer si cambia el tema para actualizar colores)
  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // destruir instancia previa si existe (cambio de tema)
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'pH',
            data: [],
            yAxisID: 'yPH',
            borderColor: colors.ph.border,
            backgroundColor: colors.ph.bg,
            borderWidth: 2,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
          },
          {
            label: 'Temperatura (°C)',
            data: [],
            yAxisID: 'yMain',
            borderColor: colors.temp.border,
            backgroundColor: colors.temp.bg,
            borderWidth: 2,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
          },
          {
            label: 'Humedad (%)',
            data: [],
            yAxisID: 'yMain',
            borderColor: colors.hum.border,
            backgroundColor: colors.hum.bg,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [6, 4],
            cubicInterpolationMode: 'monotone',
          },
          {
            label: 'Luz (%)',
            data: [],
            yAxisID: 'yMain',
            borderColor: colors.light.border,
            backgroundColor: colors.light.bg,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [2, 4],
            cubicInterpolationMode: 'monotone',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.text } },
          tooltip: { intersect: false },
        },
        scales: {
          x: {
            type: 'realtime', // 👈 scroll en tiempo real
            realtime: {
              duration: WINDOW_MS,
              delay: 1000,
              frameRate: 30,
              refresh: TICK_PRESETS[tickKey].ms, // 👈 frecuencia seleccionada
              onRefresh: (chart) => {
                const t = Date.now()
                const hour = new Date(t).getHours()
                const daylight = Math.max(0, Math.cos(((hour - 13) / 6) * Math.PI))

                const g = genRef.current
                g.ph    = nextValue(g.ph,   6.2,                     0.04, 5.5, 6.8, 2)
                g.temp  = nextValue(g.temp, 21 + daylight * 4,       0.18, 16, 30,   1)
                g.hum   = Math.round(nextValue(g.hum, 65 - daylight*10, 0.8,  35, 95))
                g.light = Math.round(nextValue(g.light, daylight*100,   1.2,  0, 100))

                chart.data.datasets[0].data.push({ x: t, y: g.ph })
                chart.data.datasets[1].data.push({ x: t, y: g.temp })
                chart.data.datasets[2].data.push({ x: t, y: g.hum })
                chart.data.datasets[3].data.push({ x: t, y: g.light })
              },
            },
            grid: { color: colors.grid },
            ticks: { color: colors.text },
          },
          yMain: {
            position: 'left',
            min: 0,
            max: 100,
            title: { display: true, text: 'Temp / %', color: colors.text },
            grid: { color: colors.grid },
            ticks: { color: colors.text },
          },
          yPH: {
            position: 'right',
            min: 5,
            max: 7,
            title: { display: true, text: 'pH', color: colors.text },
            grid: { drawOnChartArea: false, color: colors.grid },
            ticks: { color: colors.text },
          },
        },
      },
    })

    chartRef.current = newChart

    return () => {
      newChart.destroy()
      chartRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]) // rehacer chart si cambia el tema (para refrescar colores)

  // Actualizar la frecuencia sin recrear todo el chart
  React.useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    const refresh = TICK_PRESETS[tickKey].ms
    chart.options.scales.x.realtime.refresh = refresh
    chart.update('none')
  }, [tickKey])

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Card>
        <CardHeader
          title="Datos históricos"
          subheader="Scroll en tiempo real — entra por la derecha y se oculta a la izquierda"
          action={
            <ToggleButtonGroup
              size="small"
              value={tickKey}
              exclusive
              onChange={(_, v) => v && setTickKey(v)}
            >
              {Object.entries(TICK_PRESETS).map(([k, cfg]) => (
                <ToggleButton key={k} value={k}>
                  {cfg.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          }
        />
        <CardContent>
          <Box sx={{ height: 480 }}>
            <canvas ref={canvasRef} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
