// src/hooks/useApp.jsx
import * as React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TimelineIcon from '@mui/icons-material/Timeline'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist' // 👈 nuevo icono

export default function useApp() {
  const NAVIGATION = React.useMemo(
    () => [
      { kind: 'header', title: 'Panel' },
      {
        kind: 'page',
        segment: 'tower-dashboard',
        title: 'Panel principal',
        icon: <DashboardIcon />,
      },
      {
        kind: 'page',
        segment: 'tower-history',
        title: 'Datos históricos',
        icon: <TimelineIcon />,
      },

      // 👇 Sección nueva (puede ir sin header si preferís)
      { kind: 'divider' },
      { kind: 'header', title: 'Guías' },
      {
        kind: 'page',
        segment: 'crops',           // 🔗 debe coincidir con la ruta
        title: 'Catálogo de Cultivos',
        icon: <LocalFloristIcon />,
      },
    ],
    []
  )

  return { NAVIGATION }
}
