import * as React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'

export default function useApp() {
  // ⚠️ memo para que no cambie la referencia en cada render
  const NAVIGATION = React.useMemo(
    () => [
      { kind: 'header', title: 'Panel' },
      {
        kind: 'page',
        segment: 'tower-dashboard', // debe coincidir con tu ruta /tower-dashboard
        title: 'Panel principal',
        icon: <DashboardIcon />,
      },
    ],
    []
  )

  return { NAVIGATION }
}
