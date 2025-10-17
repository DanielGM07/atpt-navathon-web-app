// src/pages/TowerDashboard.jsx
import React from "react";
import HydroponicDashboard from "./components/HydroponicDashboard";
// ajustá la ruta si guardaste la api en otro lado:
import { useGetLatestTowerLogQuery } from "../apis/tower-log/tower-log.api";

const LIGHT_ADC_MAX = 1023;   // si tu LDR fuera 4095, cambialo acá
const WATER_LEVEL_MIN_CM = 12; // umbral visual que muestra la card

export default function TowerDashboard() {
  const {
    data: latest,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetLatestTowerLogQuery(undefined, {
    pollingInterval: 2000,              // ← refresca cada 2s
    refetchOnMountOrArgChange: true,
  });

  // mapear respuesta del backend → props del dashboard
  const dashboardData = React.useMemo(() => {
    if (!latest) return null;

    const ph = Number(latest.ph ?? 6);
    const temperatureC = Number(latest.temperature ?? 24);
    const humidityPct = Number(latest.humidity ?? 60);

    // convertir luz cruda (0..1023) a %
    const lightRaw = Number(latest.light ?? 0);
    const lightPct = Math.max(
      0,
      Math.min(100, Math.round((lightRaw / LIGHT_ADC_MAX) * 100)),
    );

    // hoy no tenemos nivel en cm; usamos min_water para estimar visualmente
    const minWaterLevelReached = !!latest.min_water;
    const waterLevelCm = minWaterLevelReached
      ? Math.max(0, WATER_LEVEL_MIN_CM - 0.5)  // un toque por debajo del umbral
      : WATER_LEVEL_MIN_CM + 5;                // un toque por encima

    return {
      ph,
      temperatureC,
      humidityPct,
      lightPct,
      waterLevelCm,
      waterLevelMinCm: WATER_LEVEL_MIN_CM,
      minWaterLevelReached,
      updatedAt: latest.log_time,
    };
  }, [latest]);

  if (isLoading) return <div>Cargando lecturas...</div>;
  if (isError) return <div>Error obteniendo datos de la torre.</div>;
  if (!dashboardData) return <div>Sin datos.</div>;

  return (
    <HydroponicDashboard
      data={dashboardData}
      onRefresh={isFetching ? undefined : () => refetch()}
    />
  );
}
