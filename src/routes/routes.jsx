// src/routes/index.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../layout/Layout.jsx'
import TowerDashboardPage from '../pages/TowerDashboard.jsx'
import TowerHistoryPage from '../pages/TowerHistory.jsx'
import Crops from '../pages/Crops.jsx' // 👈 nuevo import (archivo renombrado)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="tower-dashboard" replace /> },
      { path: 'tower-dashboard', element: <TowerDashboardPage /> },
      { path: 'tower-history', element: <TowerHistoryPage /> },
      { path: 'crops', element: <Crops /> }, // 👈 nueva ruta (coincide con segment del menú)
    ],
  },
])
