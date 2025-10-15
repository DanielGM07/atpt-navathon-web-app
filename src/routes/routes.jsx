import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../layout/Layout.jsx'
import TowerDashboardPage from '../pages/TowerDashboard.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="tower-dashboard" replace /> },
      { path: 'tower-dashboard', element: <TowerDashboardPage /> }, // 👈 coincide con segment
    ],
  },
])
