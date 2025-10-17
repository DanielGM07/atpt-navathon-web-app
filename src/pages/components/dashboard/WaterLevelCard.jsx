// src/components/dashboard/WaterLevelCard.jsx
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent, Chip, Stack, Typography } from '@mui/material'
import WaterDropIcon from '@mui/icons-material/WaterDrop'

/**
 * Muestra el estado del nivel de agua de forma binaria:
 * - true  → Mínimo (Crítico)
 * - false → Estable (OK)
 */
export default function WaterLevelCard({ minWaterLevelReached }) {
	const isMin = !!minWaterLevelReached

	const status = {
		label: isMin ? 'Mínimo' : 'Estable',
		color: isMin ? 'error' : 'success',
	}

	return (
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
				<Stack spacing={2} alignItems="flex-start">
					<Chip
						label={status.label}
						color={status.color}
						size="medium"
						variant={isMin ? 'filled' : 'outlined'}
						sx={{ fontSize: '1rem', fontWeight: 600 }}
					/>
					<Typography variant="body2" color="text.secondary">
						Estado actual del tanque: {isMin ? 'El nivel está en el mínimo crítico' : 'Nivel estable y seguro'}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	)
}

WaterLevelCard.propTypes = {
	minWaterLevelReached: PropTypes.bool.isRequired,
}
