import * as React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { PageContainer } from '@toolpad/core/PageContainer'
import { AppProvider } from '@toolpad/core/AppProvider'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import useApp from '../hooks/useApp.jsx'

export default function Layout() {
  const { NAVIGATION } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ title: 'Torre Hidropónica', logo: <WaterDropIcon /> }}
      router={{ pathname, navigate }} // 🔗 vincula Toolpad con React Router
    >
      <DashboardLayout /* sin prop navigation aquí */ sidebarExpanded>
        <PageContainer sx={{ p: 3 }}>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  )
}
