// src/pages/TowerHistory.jsx
import React from 'react'
import { Box, Card, CardHeader, CardContent, Snackbar, Alert } from '@mui/material'
import { useTheme, alpha as muiAlpha } from '@mui/material/styles'

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import 'chartjs-adapter-date-fns'

import { useListTowerLogsQuery, useGetLatestTowerLogQuery } from '../apis/tower-log/tower-log.api'

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
)

const GAP_MS = 4000
const POLL_MS = 2000
const VIEW_MS = 2 * 60 * 1000 // ⬅️ ventana visible: últimos 2 minutos

// ----- Utils

const toTs = v => {
  if (v == null) return NaN
  const n = typeof v === 'number' ? v : Date.parse(v)
  if (!Number.isFinite(n)) return NaN
  return n < 1e12 ? n * 1000 : n
}

// contempla `log_time` (tu backend)
function mapRow(row) {
  const t = toTs(row.log_time ?? row.timestamp ?? row.created_at ?? row.createdAt ?? row.date ?? row.t ?? row.time)

  const ph = Number(row.ph ?? row.pH)
  const temp = Number(row.temperature ?? row.temperatureC ?? row.temp)
  const hum = Number(row.humidity ?? row.humidityPct ?? row.hum)
  const rawLight = Number(row.light ?? row.lightPct ?? row.lux)
  const light = Number.isFinite(rawLight) ? Math.max(0, Math.min(100, ((rawLight - 600) * 100) / 400)) : NaN

  return { t, ph, temp, hum, light }
}

function buildSeriesWithGaps(points) {
  const series = { ph: [], temp: [], hum: [], light: [] }
  const gapSegments = []

  if (!points.length) return { series, gapSegments, greyOverlay: { ph: [], main: [] } }

  const MID_PH = 6
  const MID_MAIN = 50

  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const prev = i > 0 ? points[i - 1] : null
    const isGap = prev && p.t - prev.t > GAP_MS

    if (isGap) {
      const breakTs = prev.t + 1
      series.ph.push({ x: breakTs, y: NaN })
      series.temp.push({ x: breakTs, y: NaN })
      series.hum.push({ x: breakTs, y: NaN })
      series.light.push({ x: breakTs, y: NaN })
      gapSegments.push({ start: prev.t, end: p.t })
    }

    series.ph.push({ x: p.t, y: p.ph })
    series.temp.push({ x: p.t, y: p.temp })
    series.hum.push({ x: p.t, y: p.hum })
    series.light.push({ x: p.t, y: p.light })
  }

  const greyOverlayPH = []
  const greyOverlayMain = []
  for (const g of gapSegments) {
    const s = g.start + 1
    const e = g.end - 1
    if (e > s) {
      greyOverlayPH.push({ x: s, y: MID_PH }, { x: e, y: MID_PH }, { x: e + 1, y: NaN })
      greyOverlayMain.push({ x: s, y: MID_MAIN }, { x: e, y: MID_MAIN }, { x: e + 1, y: NaN })
    }
  }

  return {
    series,
    gapSegments,
    greyOverlay: { ph: greyOverlayPH, main: greyOverlayMain },
  }
}

// ⬅️ fija la ventana deslizante (tipo Binance)
function setXWindow(chart, endTs) {
  chart.options.scales.x.min = endTs - VIEW_MS
  chart.options.scales.x.max = endTs
}

// ----- Component

export default function TowerHistoryPage() {
  const theme = useTheme()
  const canvasRef = React.useRef(null)
  const chartRef = React.useRef(null)

  const [snack, setSnack] = React.useState({ open: false, msg: '' })

  const colors = React.useMemo(() => {
    const p = theme.palette
    return {
      ph: { border: p.primary.main, bg: muiAlpha(p.primary.main, 0.12) },
      temp: { border: p.error.main, bg: muiAlpha(p.error.main, 0.12) },
      hum: { border: p.info.main, bg: muiAlpha(p.info.main, 0.12) },
      light: { border: p.success.main, bg: muiAlpha(p.success.main, 0.12) },
      grey: { border: p.text.disabled, bg: muiAlpha(p.text.disabled, 0.16) },
      grid: p.divider,
      text: p.text.secondary,
    }
  }, [theme])

  const { data: listData, isFetching: isLoadingList } = useListTowerLogsQuery()
  const { data: latestData } = useGetLatestTowerLogQuery(undefined, {
    pollingInterval: POLL_MS,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  })

  const allPointsRef = React.useRef([])
  const gapsRef = React.useRef([])

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    const chart = new ChartJS(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            // overlay gris yMain
            label: 'Sin datos (Temp/Humedad/Luz)',
            data: [],
            yAxisID: 'yMain',
            borderColor: colors.grey.border,
            backgroundColor: colors.grey.bg,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            // overlay gris pH
            label: 'Sin datos (pH)',
            data: [],
            yAxisID: 'yPH',
            borderColor: colors.grey.border,
            backgroundColor: colors.grey.bg,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: 'pH',
            data: [],
            yAxisID: 'yPH',
            borderColor: colors.ph.border,
            backgroundColor: colors.ph.bg,
            borderWidth: 2,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
            spanGaps: false,
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
            spanGaps: false,
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
            spanGaps: false,
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
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.text } },
          tooltip: {
            intersect: false,
            callbacks: {
              beforeBody: items => {
                if (!items?.length) return
                const x = items[0].parsed.x
                const gap = gapsRef.current.find(g => x >= g.start && x <= g.end)
                return gap
                  ? [`Sin datos: ${new Date(gap.start).toLocaleString()} — ${new Date(gap.end).toLocaleString()}`]
                  : undefined
              },
            },
          },
        },
        onClick: (evt, _els, chartInstance) => {
          const xVal = chartInstance.scales.x.getValueForPixel(evt.x)
          const gap = gapsRef.current.find(g => xVal >= g.start && xVal <= g.end)
          if (gap) {
            setSnack({
              open: true,
              msg: `No hay datos entre ${new Date(gap.start).toLocaleString()} y ${new Date(gap.end).toLocaleString()}`,
            })
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'second',
              stepSize: 10, // una línea de grilla cada 10 segundos
              tooltipFormat: 'dd/MM/yyyy HH:mm:ss',
              displayFormats: { second: 'HH:mm:ss' },
            },
            grid: { color: colors.grid },
            ticks: {
              color: colors.text,
              autoSkip: true,
              maxRotation: 0,
            },
          },
          yMain: {
            position: 'left',
            min: 0,
            max: 200, // tu `light` llega a 170
            title: { display: true, text: 'Temp / % / Luz', color: colors.text },
            grid: { color: colors.grid },
            ticks: { color: colors.text },
          },
          yPH: {
            position: 'right',
            min: 0,
            max: 10,
            title: { display: true, text: 'pH', color: colors.text },
            grid: { drawOnChartArea: false, color: colors.grid },
            ticks: { color: colors.text },
          },
        },
      },
    })

    chartRef.current = chart
    return () => {
      chart.destroy()
      chartRef.current = null
    }
  }, [colors])

  // Seed inicial (todo el histórico)
  React.useEffect(() => {
    if (!listData || !chartRef.current || isLoadingList) return
    const chart = chartRef.current

    const points = listData
      .map(mapRow)
      .filter(p => Number.isFinite(p.t))
      .sort((a, b) => a.t - b.t)

    if (!points.length) return

    allPointsRef.current = points

    const { series, gapSegments, greyOverlay } = buildSeriesWithGaps(points)
    gapsRef.current = gapSegments

    chart.data.datasets[0].data = greyOverlay.main
    chart.data.datasets[1].data = greyOverlay.ph
    chart.data.datasets[2].data = series.ph
    chart.data.datasets[3].data = series.temp
    chart.data.datasets[4].data = series.hum
    chart.data.datasets[5].data = series.light

    // ⬅️ Ventana deslizante: centramos en el último timestamp del histórico
    const lastTs = points.at(-1).t
    setXWindow(chart, lastTs)

    chart.update('none')
  }, [listData, isLoadingList])

  // Append incremental cada 2s
  React.useEffect(() => {
    if (!latestData || !chartRef.current) return
    const chart = chartRef.current

    const latest = mapRow(latestData)
    if (!Number.isFinite(latest.t)) return

    const last = allPointsRef.current[allPointsRef.current.length - 1]
    if (last && latest.t <= last.t) return

    const isGap = last && latest.t - last.t > GAP_MS
    if (isGap) {
      const breakTs = last.t + 1
      chart.data.datasets[2].data.push({ x: breakTs, y: NaN })
      chart.data.datasets[3].data.push({ x: breakTs, y: NaN })
      chart.data.datasets[4].data.push({ x: breakTs, y: NaN })
      chart.data.datasets[5].data.push({ x: breakTs, y: NaN })

      const s = last.t + 1
      const e = latest.t - 1
      if (e > s) {
        chart.data.datasets[0].data.push({ x: s, y: 50 }, { x: e, y: 50 }, { x: e + 1, y: NaN })
        chart.data.datasets[1].data.push({ x: s, y: 6 }, { x: e, y: 6 }, { x: e + 1, y: NaN })
        gapsRef.current.push({ start: last.t, end: latest.t })
      }
    }

    chart.data.datasets[2].data.push({ x: latest.t, y: latest.ph })
    chart.data.datasets[3].data.push({ x: latest.t, y: latest.temp })
    chart.data.datasets[4].data.push({ x: latest.t, y: latest.hum })
    chart.data.datasets[5].data.push({ x: latest.t, y: latest.light })

    allPointsRef.current.push(latest)

    // ⬅️ Mueve la ventana al “ahora” (último punto)
    setXWindow(chart, latest.t)

    chart.update('none')
  }, [latestData])

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Card>
        <CardHeader
          title="Grafico en Tiempo Real"
          subheader="Vista en vivo (últimos 2 min) + actualización cada 2s. Cortes en gris a mitad de escala."
        />
        <CardContent>
          <Box sx={{ height: 480 }}>
            <canvas ref={canvasRef} />
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
