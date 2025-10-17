// src/components/dashboard/MetricCard.jsx
import PropTypes from 'prop-types'
import { Card, CardHeader, CardContent, Typography, Chip, Stack, LinearProgress } from '@mui/material'

export default function MetricCard({ title, icon, value, unit, progressValue, status, footer }) {
	return (
		<Card variant="outlined" sx={{ height: '100%' }}>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						{icon}
						<Typography variant="h6">{title}</Typography>
					</Stack>
				}
				sx={{ pb: 0.5 }}
			/>
			<CardContent>
				<Stack spacing={1.5}>
					<Stack direction="row" alignItems="baseline" spacing={1}>
						<Typography variant="h4" fontWeight={700}>{value}</Typography>
						{unit && <Typography variant="subtitle1" color="text.secondary">{unit}</Typography>}
						{status && <Chip size="small" label={status.label} color={status.color} sx={{ ml: 'auto' }} />}
					</Stack>
					{typeof progressValue === 'number' && (
						<LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 999 }} />
					)}
					{footer}
				</Stack>
			</CardContent>
		</Card>
	)
}

MetricCard.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.node,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	unit: PropTypes.string,
	progressValue: PropTypes.number,
	status: PropTypes.shape({
		label: PropTypes.string,
		color: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
	}),
	footer: PropTypes.node,
}
