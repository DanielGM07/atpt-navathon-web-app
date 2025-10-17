// src/components/dashboard/MetricsGrid.jsx
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import MetricTile from './MetricTile'
import { getBandStatus } from '../../../utils/metrics'
import OpacityIcon from '@mui/icons-material/Opacity'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import AirIcon from '@mui/icons-material/Air'
import LightModeIcon from '@mui/icons-material/LightMode'

/**
 * Devuelve ITEMS de Grid (no contenedor).
 * Podés pasar `keys` para elegir cuáles métricas renderizar y en qué orden.
 * keys válidas: 'ph' | 'temperatureC' | 'humidityPct' | 'lightPct'
 */
export default function MetricsGrid({ data, ranges, keys }) {
  const catalog = {
    ph: {
      key: 'ph',
      title: 'pH del agua',
      icon: <OpacityIcon color="primary" />,
      value: data.ph?.toFixed(1),
      unit: 'pH',
      status: getBandStatus(data.ph, ranges.ph),
      footer: `Óptimo: ${ranges.ph.ok[0]}–${ranges.ph.ok[1]} • Aceptable: ${ranges.ph.warn[0]}–${ranges.ph.warn[1]}`,
      min: 0, max: 14,
    },
    temperatureC: {
      key: 'temperatureC',
      title: 'Temperatura',
      icon: <DeviceThermostatIcon color="primary" />,
      value: data.temperatureC?.toFixed(1),
      unit: '°C',
      status: getBandStatus(data.temperatureC, ranges.temperatureC),
      footer: `Óptimo: ${ranges.temperatureC.ok[0]}–${ranges.temperatureC.ok[1]} °C`,
      min: 0, max: 40,
    },
    humidityPct: {
      key: 'humidityPct',
      title: 'Humedad',
      icon: <AirIcon color="primary" />,
      value: data.humidityPct?.toFixed(0),
      unit: '%',
      status: getBandStatus(data.humidityPct, ranges.humidityPct),
      footer: `Óptimo: ${ranges.humidityPct.ok[0]}–${ranges.humidityPct.ok[1]}%`,
      min: 0, max: 100,
    },
    lightPct: {
      key: 'lightPct',
      title: 'Nivel de luz',
      icon: <LightModeIcon color="primary" />,
      value: data.lightPct?.toFixed(0),
      unit: '%',
      status: getBandStatus(data.lightPct, ranges.lightPct),
      footer: `Rango objetivo: ${ranges.lightPct.ok[0]}–${ranges.lightPct.ok[1]}%`,
      min: 0, max: 100,
    },
  }

  const order = keys && keys.length ? keys : ['ph', 'temperatureC', 'humidityPct', 'lightPct']
  const items = order.map(k => catalog[k]).filter(Boolean)

  return (
    <>
      {items.map((m) => (
        <Grid key={m.key} item xs={12} sm={6} md={4}>
          <MetricTile
            title={m.title}
            icon={m.icon}
            value={m.value}
            unit={m.unit}
            status={m.status}
            footerHint={m.footer}
            progressMin={m.min}
            progressMax={m.max}
          />
        </Grid>
      ))}
    </>
  )
}

MetricsGrid.propTypes = {
  data: PropTypes.shape({
    ph: PropTypes.number,
    temperatureC: PropTypes.number,
    humidityPct: PropTypes.number,
    lightPct: PropTypes.number,
  }).isRequired,
  ranges: PropTypes.object.isRequired,
  keys: PropTypes.arrayOf(PropTypes.oneOf(['ph','temperatureC','humidityPct','lightPct'])),
}
