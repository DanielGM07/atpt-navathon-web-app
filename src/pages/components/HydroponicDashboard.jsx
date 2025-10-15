import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import OpacityIcon from '@mui/icons-material/Opacity'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import LightModeIcon from '@mui/icons-material/LightMode'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import AirIcon from '@mui/icons-material/Air'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

/**
 * Panel de control para torre hidropónica (primer vistazo)
 *
 * Props:
 * - data: {
 *     ph: number (0–14),
 *     temperatureC: number,
 *     humidityPct: number (0–100),
 *     lightPct: number (0–100),
 *     waterLevelCm: number,             // nivel actual
 *     waterLevelMinCm: number,          // umbral mínimo recomendado
 *     minWaterLevelReached: boolean,    // ¿se alcanzó el mínimo? (SI/NO)
 *     updatedAt: string | number | Date // timestamp última lectura
 *   }
 * - onRefresh: function? (callback para recargar lecturas)
 * - ranges (opcional): configuración de umbrales por métrica
 */
const defaultRanges = {
  ph: { ok: [5.5, 6.5], warn: [5.0, 7.0] }, // fuera de warn -> error
  temperatureC: { ok: [20, 26], warn: [18, 28] },
  humidityPct: { ok: [50, 70], warn: [40, 80] },
  lightPct: { ok: [60, 90], warn: [40, 95] }, // depende del cultivo y fotoperiodo
  // Para el agua evaluamos contra waterLevelMinCm relativo al tanque
}

function getBandStatus(value, { ok, warn }) {
  if (value >= ok[0] && value <= ok[1]) return { label: 'Óptimo', color: 'success' }
  if (value >= warn[0] && value <= warn[1]) return { label: 'Atento', color: 'warning' }
  return { label: 'Crítico', color: 'error' }
}

function percent(value, min, max) {
  if (max === min) return 0
  const p = ((value - min) * 100) / (max - min)
  return Math.max(0, Math.min(100, p))
}

function MetricCard({
  title,
  icon,
  value,
  unit,
  progressValue, // 0–100
  status,
  footer,
}) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Stack>
        }
        sx={{ pb: 0.5 }}
      />
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {unit && (
              <Typography variant="subtitle1" color="text.secondary">
                {unit}
              </Typography>
            )}
            {status && <Chip size="small" label={status.label} color={status.color} sx={{ ml: 'auto' }} />}
          </Stack>
          {typeof progressValue === 'number' && (
            <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 999 }} />
          )}
          {footer}
        </Stack>
      </CardContent>
    </Card>
  )
}

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  progressValue: PropTypes.number,
  status: PropTypes.shape({
    label: PropTypes.string,
    color: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
  }),
  footer: PropTypes.node,
}

export default function HydroponicDashboard({ data, onRefresh, ranges = defaultRanges }) {
  const {
    ph = 6.0,
    temperatureC = 24,
    humidityPct = 65,
    lightPct = 75,
    waterLevelCm = 18,
    waterLevelMinCm = 12,
    minWaterLevelReached = false,
    updatedAt = new Date(),
  } = data || {}

  const phStatus = getBandStatus(ph, ranges.ph)
  const tempStatus = getBandStatus(temperatureC, ranges.temperatureC)
  const humStatus = getBandStatus(humidityPct, ranges.humidityPct)
  const lightStatus = getBandStatus(lightPct, ranges.lightPct)

  const waterIsLow = minWaterLevelReached || waterLevelCm <= waterLevelMinCm
  const waterStatus = {
    label: waterIsLow ? 'Mínimo alcanzado' : 'OK',
    color: waterIsLow ? 'error' : 'success',
  }

  // Para la barra de agua, normalizamos 0–30cm como rango visual (ajustá según tu tanque)
  const waterProgress = percent(waterLevelCm, 0, Math.max(30, waterLevelMinCm + 10))

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Panel de Control — Torre Hidropónica
        </Typography>
        <Chip
          size="small"
          icon={<WarningAmberIcon />}
          label={`Mínimo de agua: ${waterLevelMinCm} cm`}
          variant="outlined"
          sx={{ ml: 1 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Actualizar lecturas">
          <span>
            <IconButton onClick={onRefresh} disabled={!onRefresh}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Grid container spacing={2}>
        {/* PH */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="pH del agua"
            icon={<OpacityIcon color="primary" />}
            value={ph.toFixed(1)}
            unit="pH"
            progressValue={percent(ph, 0, 14)}
            status={phStatus}
            footer={
              <Typography variant="caption" color="text.secondary">
                Óptimo: {ranges.ph.ok[0]}–{ranges.ph.ok[1]} • Aceptable: {ranges.ph.warn[0]}–{ranges.ph.warn[1]}
              </Typography>
            }
          />
        </Grid>

        {/* Temperatura */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Temperatura"
            icon={<DeviceThermostatIcon color="primary" />}
            value={temperatureC.toFixed(1)}
            unit="°C"
            progressValue={percent(temperatureC, 0, 40)}
            status={tempStatus}
            footer={
              <Typography variant="caption" color="text.secondary">
                Óptimo: {ranges.temperatureC.ok[0]}–{ranges.temperatureC.ok[1]} °C
              </Typography>
            }
          />
        </Grid>

        {/* Humedad */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Humedad"
            icon={<AirIcon color="primary" />}
            value={humidityPct.toFixed(0)}
            unit="%"
            progressValue={percent(humidityPct, 0, 100)}
            status={humStatus}
            footer={
              <Typography variant="caption" color="text.secondary">
                Óptimo: {ranges.humidityPct.ok[0]}–{ranges.humidityPct.ok[1]}%
              </Typography>
            }
          />
        </Grid>

        {/* Luz */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Nivel de luz"
            icon={<LightModeIcon color="primary" />}
            value={lightPct.toFixed(0)}
            unit="%"
            progressValue={percent(lightPct, 0, 100)}
            status={lightStatus}
            footer={
              <Typography variant="caption" color="text.secondary">
                Rango objetivo: {ranges.lightPct.ok[0]}–{ranges.lightPct.ok[1]}%
              </Typography>
            }
          />
        </Grid>

        {/* Nivel de agua */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WaterDropIcon color="primary" />
                  <Typography variant="h6">Nivel de agua</Typography>
                </Stack>
              }
              sx={{ pb: 0.5 }}
            />
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="h4" fontWeight={700}>
                    {waterLevelCm.toFixed(1)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    cm
                  </Typography>
                  <Chip size="small" label={waterStatus.label} color={waterStatus.color} sx={{ ml: 'auto' }} />
                </Stack>

                <LinearProgress variant="determinate" value={waterProgress} sx={{ height: 10, borderRadius: 999 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    0 cm
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.max(30, waterLevelMinCm + 10)} cm
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={minWaterLevelReached ? 'Mínimo: SÍ' : 'Mínimo: NO'}
                    color={minWaterLevelReached ? 'error' : 'success'}
                    size="small"
                    variant={minWaterLevelReached ? 'filled' : 'outlined'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Umbral mínimo configurado: {waterLevelMinCm} cm
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Última actualización / meta info */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title="Estado general" sx={{ pb: 0.5 }} />
            <CardContent>
              <Stack spacing={1.25}>
                <StatusRow label="Sensores" value="Online" color="success" />
                <StatusRow
                  label="Bomba de riego"
                  value={waterIsLow ? 'Revisar (nivel bajo)' : 'OK'}
                  color={waterIsLow ? 'warning' : 'success'}
                />
                <StatusRow label="Solución nutritiva" value={phStatus.label} color={phStatus.color} />
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Última actualización: {new Date(updatedAt).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  * Los rangos son genéricos. Ajustá por cultivo/etapa fenológica.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

function StatusRow({ label, value, color = 'default' }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body2" sx={{ minWidth: 160 }}>
        {label}
      </Typography>
      <Chip size="small" label={value} color={color} />
    </Stack>
  )
}

StatusRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
}

/* ========== Ejemplo de uso rápido (mock) ==========
import HydroponicDashboard from "@/components/HydroponicDashboard";

export default function TowerPage() {
  const [data, setData] = React.useState({
    ph: 6.1,
    temperatureC: 24.3,
    humidityPct: 62,
    lightPct: 78,
    waterLevelCm: 17.5,
    waterLevelMinCm: 12,
    minWaterLevelReached: false,
    updatedAt: Date.now(),
  });

  const handleRefresh = () => {
    // Acá conectarías con RTK Query para traer lecturas reales:
    // dispatch(api.endpoints.getTowerReadings.initiate())
    // En este mock, solo variamos un poco:
    setData((d) => ({
      ...d,
      ph: +(d.ph + (Math.random() * 0.2 - 0.1)).toFixed(1),
      temperatureC: +(d.temperatureC + (Math.random() * 0.6 - 0.3)).toFixed(1),
      humidityPct: Math.max(0, Math.min(100, Math.round(d.humidityPct + (Math.random() * 4 - 2)))),
      updatedAt: Date.now(),
    }));
  };

  return <HydroponicDashboard data={data} onRefresh={handleRefresh} />;
}
==================================================== */

/* ========== RTK Query (borrador de endpoint) ==========
 // apis/towerApi.js
 import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 export const towerApi = createApi({
   reducerPath: "towerApi",
   baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APP_API_BASE_URL }),
   endpoints: (builder) => ({
     getTowerReadings: builder.query({
       query: (towerId) => `/api/towers/${towerId}/readings/latest`,
       transformResponse: (res) => ({
         ph: res.ph,
         temperatureC: res.temperatureC,
         humidityPct: res.humidityPct,
         lightPct: res.lightPct,
         waterLevelCm: res.waterLevelCm,
         waterLevelMinCm: res.waterLevelMinCm,
         minWaterLevelReached: res.minWaterLevelReached,
         updatedAt: res.updatedAt,
       }),
     }),
   }),
 });

 export const { useGetTowerReadingsQuery } = towerApi;

 // En un componente:
 const { data, refetch, isFetching } = useGetTowerReadingsQuery("tower-01");
 <HydroponicDashboard data={data} onRefresh={refetch} />
====================================================== */
