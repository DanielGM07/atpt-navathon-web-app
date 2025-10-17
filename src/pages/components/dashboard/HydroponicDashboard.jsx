// src/components/dashboard/HydroponicDashboard.jsx
import PropTypes from 'prop-types'
import { Box, Grid } from '@mui/material'
import DashboardHeader from './DashboardHeader'
import MetricTile from './MetricTile'
import WaterLevelCard from './WaterLevelCard'
import SystemStatusCard from './SystemStatusCard'
import { defaultRanges } from '../../../config/ranges'
import { getBandStatus } from '../../../utils/metrics'

// Icons
import OpacityIcon from '@mui/icons-material/Opacity'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import AirIcon from '@mui/icons-material/Air'
import LightModeIcon from '@mui/icons-material/LightMode'

export default function HydroponicDashboard({ data, onRefresh, ranges = defaultRanges }) {
  const {
    ph = 6.0,
    temperatureC = 24,
    humidityPct = 65,
    lightPct = 75,
    minWaterLevelReached = false,
    waterLevelMinCm = 12,
  } = data || {}

  // estados por métrica
  const phS = getBandStatus(ph, ranges.ph).label
  const tS  = getBandStatus(temperatureC, ranges.temperatureC).label
  const hS  = getBandStatus(humidityPct, ranges.humidityPct).label
  const lS  = getBandStatus(lightPct, ranges.lightPct).label

  // estado sistema
  const anyCritical = minWaterLevelReached || [phS, tS, hS, lS].includes('Crítico')
  const anyWarning  = !anyCritical && [phS, tS, hS, lS].includes('Atento')
  const systemLevel = anyCritical ? 'Crítico' : anyWarning ? 'Alerta' : 'Estable'

  const notes = []
  if (minWaterLevelReached) notes.push('Nivel de agua: Mínimo')
  if (phS === 'Crítico' || phS === 'Atento') notes.push(`pH: ${phS}`)
  if (tS  === 'Crítico' || tS  === 'Atento') notes.push(`Temperatura: ${tS}`)
  if (hS  === 'Crítico' || hS  === 'Atento') notes.push(`Humedad: ${hS}`)
  if (lS  === 'Crítico' || lS  === 'Atento') notes.push(`Luz: ${lS}`)

  return (
    <Box sx={{ p: 2 }}>
      <DashboardHeader waterLevelMinCm={waterLevelMinCm} onRefresh={onRefresh} />

      {/*
        Un ÚNICO Grid container con 6 ítems (xs=12 sm=6 md=4 = 3 por fila en md+).
        Insertamos un "row break" (Grid item xs=12) ANTES de Humedad para
        forzarla SIEMPRE a la segunda fila.
      */}
      <Grid container spacing={2}>
        {/* ===== FILA 1: 3 CARDS ===== */}
        <Grid item xs={12} sm={6} md={12}>
          <SystemStatusCard level={systemLevel} notes={notes} />
        </Grid>

        <Grid item xs={12} sm={6} md={10}>
          <MetricTile
            title="pH del agua"
            icon={<OpacityIcon color="primary" />}
            value={ph.toFixed(1)}
            unit="pH"
            status={getBandStatus(ph, ranges.ph)}
            footerHint={`Óptimo: ${ranges.ph.ok[0]}–${ranges.ph.ok[1]} • Aceptable: ${ranges.ph.warn[0]}–${ranges.ph.warn[1]}`}
            progressMin={0}
            progressMax={14}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={10}>
          <MetricTile
            title="Temperatura"
            icon={<DeviceThermostatIcon color="primary" />}
            value={temperatureC.toFixed(1)}
            unit="°C"
            status={getBandStatus(temperatureC, ranges.temperatureC)}
            footerHint={`Óptimo: ${ranges.temperatureC.ok[0]}–${ranges.temperatureC.ok[1]} °C`}
            progressMin={0}
            progressMax={40}
          />
        </Grid>

        {/* ===== CORTE DE FILA (fuerza siguiente item a segunda fila) ===== */}
        <Grid item xs={12} />

        {/* ===== FILA 2: 3 CARDS ===== */}
        {/* HUMEDAD: SIEMPRE EN LA FILA 2 (queda fija por orden en el DOM + row break) */}
        <Grid item xs={12} sm={6} md={10}>
          <MetricTile
            title="Humedad"
            icon={<AirIcon color="primary" />}
            value={humidityPct.toFixed(0)}
            unit="%"
            status={getBandStatus(humidityPct, ranges.humidityPct)}
            footerHint={`Óptimo: ${ranges.humidityPct.ok[0]}–${ranges.humidityPct.ok[1]}%`}
            progressMin={0}
            progressMax={100}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricTile
            title="Nivel de luz"
            icon={<LightModeIcon color="primary" />}
            value={lightPct.toFixed(0)}
            unit="%"
            status={getBandStatus(lightPct, ranges.lightPct)}
            footerHint={`Rango objetivo: ${ranges.lightPct.ok[0]}–${ranges.lightPct.ok[1]}%`}
            progressMin={0}
            progressMax={100}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <WaterLevelCard minWaterLevelReached={minWaterLevelReached} />
        </Grid>
      </Grid>
    </Box>
  )
}

HydroponicDashboard.propTypes = {
  data: PropTypes.shape({
    ph: PropTypes.number,
    temperatureC: PropTypes.number,
    humidityPct: PropTypes.number,
    lightPct: PropTypes.number,
    minWaterLevelReached: PropTypes.bool,
    waterLevelMinCm: PropTypes.number,
  }),
  onRefresh: PropTypes.func,
  ranges: PropTypes.object,
}
