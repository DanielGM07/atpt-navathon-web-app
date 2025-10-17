// src/components/dashboard/MetricTile.jsx
import PropTypes from 'prop-types'
import MetricCard from './MetricCard'
import { Typography } from '@mui/material'
import { percent } from '../../../utils/metrics'

export default function MetricTile({ title, icon, value, unit, status, footerHint, progressMin = 0, progressMax = 100 }) {
	return (
		<MetricCard
			title={title}
			icon={icon}
			value={value}
			unit={unit}
			status={status}
			progressValue={percent(Number(value), progressMin, progressMax)}
			footer={<Typography variant="caption" color="text.secondary">{footerHint}</Typography>}
		/>
	)
}

MetricTile.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.node,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	unit: PropTypes.string,
	status: PropTypes.object,
	footerHint: PropTypes.string,
	progressMin: PropTypes.number,
	progressMax: PropTypes.number,
}
