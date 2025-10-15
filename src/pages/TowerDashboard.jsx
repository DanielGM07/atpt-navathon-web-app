// src/pages/TowerDashboard.jsx
import React from 'react'
import HydroponicDashboard from './components/HydroponicDashboard'

export default function TowerDashboard() {
  const [data, setData] = React.useState({
    ph: 6.2,
    temperatureC: 24.5,
    humidityPct: 60,
    lightPct: 75,
    waterLevelCm: 18,
    waterLevelMinCm: 12,
    minWaterLevelReached: false,
    updatedAt: new Date(),
  })

  const handleRefresh = () => {
    // Acá después conectarías con RTK Query o API real
    setData(prev => ({
      ...prev,
      ph: +(prev.ph + (Math.random() * 0.2 - 0.1)).toFixed(1),
      temperatureC: +(prev.temperatureC + (Math.random() * 0.5 - 0.25)).toFixed(1),
      humidityPct: Math.min(100, Math.max(0, prev.humidityPct + (Math.random() * 4 - 2))),
      updatedAt: new Date(),
    }))
  }

  return <HydroponicDashboard data={data} onRefresh={handleRefresh} />
}
