// src/components/dashboard/DashboardHeader.jsx
import PropTypes from 'prop-types'
import { Stack, Typography, Chip, Box, IconButton, Tooltip } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

export default function DashboardHeader({ waterLevelMinCm, onRefresh }) {
	return (
		<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
			{/* <Typography variant="h5" fontWeight={700}>Panel de Control — Torre Hidropónica</Typography> */}
            <Typography variant="h5" fontWeight={700}>Datos de la Torre</Typography>
			{/* <Chip
				size="small"
				icon={<WarningAmberIcon />}
				label={`Mínimo de agua: ${waterLevelMinCm} cm`}
				variant="outlined"
				sx={{ ml: 1 }}
			/> */}
			<Box sx={{ flexGrow: 1 }} />
			<Tooltip title="Actualizar lecturas">
				<span>
					<IconButton onClick={onRefresh} disabled={!onRefresh}>
						<RefreshIcon />
					</IconButton>
				</span>
			</Tooltip>
		</Stack>
	)
}

DashboardHeader.propTypes = {
	waterLevelMinCm: PropTypes.number.isRequired,
	onRefresh: PropTypes.func,
}
