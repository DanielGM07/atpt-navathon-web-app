// src/components/dashboard/SystemStatusCard.jsx
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent, Chip, Stack, Typography } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'

/**
 * Estados posibles:
 * - 'Estable' (success)
 * - 'Alerta'  (warning) → si alguna métrica está en alerta y ninguna en crítico
 * - 'Crítico' (error)   → si alguna métrica está en crítico
 */
export default function SystemStatusCard({ level, notes = [] }) {
	const map = {
		Estable: { color: 'success', desc: 'Todas las métricas se encuentran dentro de valores óptimos.' },
		Alerta:  { color: 'warning', desc: 'Hay métricas en zona de atención. Recomendado ajustar cuanto antes.' },
		Crítico: { color: 'error',   desc: 'Hay métricas en estado crítico. Requiere intervención inmediata.' },
	}
	const meta = map[level] || map.Estable

	return (
		<Card variant="outlined" sx={{ height: '100%' }}>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SecurityIcon color="primary" />
						<Typography variant="h6">Estado del sistema</Typography>
					</Stack>
				}
				sx={{ pb: 0.5 }}
			/>
			<CardContent>
				<Stack spacing={1.5} alignItems="flex-start">
					<Chip label={level} color={meta.color} size="medium" sx={{ fontSize: '1rem', fontWeight: 600 }} />
					<Typography variant="body2" color="text.secondary">
						{meta.desc}
					</Typography>
					{notes.length > 0 && (
						<Stack spacing={0.5} sx={{ mt: 0.5 }}>
							<Typography variant="caption" color="text.secondary">Detalles:</Typography>
							{notes.map((n, i) => (
								<Typography key={i} variant="caption" color="text.secondary">• {n}</Typography>
							))}
						</Stack>
					)}
				</Stack>
			</CardContent>
		</Card>
	)
}

SystemStatusCard.propTypes = {
	level: PropTypes.oneOf(['Estable', 'Alerta', 'Crítico']).isRequired,
	notes: PropTypes.arrayOf(PropTypes.string),
}
