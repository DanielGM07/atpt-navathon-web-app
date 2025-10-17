// components/CropCard.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActionArea,
  Collapse,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const difficultyStyles = {
  easy: (theme) => ({
    bg: theme.palette.success.light + "22", // /10 aprox
    border: theme.palette.success.main + "44",
    dot: theme.palette.success.main,
    title: theme.palette.success.main,
  }),
  intermediate: (theme) => ({
    bg: theme.palette.warning.light + "22",
    border: theme.palette.warning.main + "44",
    dot: theme.palette.warning.main,
    title: theme.palette.warning.main,
  }),
  advanced: (theme) => ({
    bg: theme.palette.orange?.light
      ? theme.palette.orange.light + "22"
      : theme.palette.warning.dark + "22",
    border: theme.palette.warning.dark + "44",
    dot: theme.palette.warning.dark,
    title: theme.palette.warning.dark,
  }),
};

export default function CropCard({
  name,
  emoji,
  difficulty,
  phRange,
  growthCycle,
  description,
  temperature,
  light,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      variant="outlined"
      sx={(theme) => {
        const c = difficultyStyles[difficulty](theme);
        return {
          bgcolor: c.bg,
          borderColor: c.border,
          borderRadius: 2,
          transition: "box-shadow .2s, transform .15s",
          "&:hover": { boxShadow: 3 },
        };
      }}
    >
      <CardActionArea
        onClick={() => setOpen((v) => !v)}
        sx={{ p: 2, alignItems: "stretch", display: "block" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            aria-hidden
            sx={{
              fontSize: 32,
              transform: open ? "scale(1.08)" : "scale(1)",
              transition: "transform .2s",
            }}
          >
            {emoji}
          </Box>

          <Box flex={1} minWidth={0}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {name}
            </Typography>
          </Box>

          <IconButton
            size="small"
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .2s",
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2, opacity: 0.6 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.5, lineHeight: 1.6 }}
          >
            {description}
          </Typography>

          <Box display="grid" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <WaterDropIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                pH óptimo:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {phRange}
              </Typography>
            </Box>

            {growthCycle && (
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Ciclo:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {growthCycle}
                </Typography>
              </Box>
            )}

            {temperature && (
              <Box display="flex" alignItems="center" gap={1}>
                <DeviceThermostatIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Temperatura:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {temperature}
                </Typography>
              </Box>
            )}

            {light && (
              <Box display="flex" alignItems="center" gap={1}>
                <WbSunnyIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Luz:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {light}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardActionArea>
    </Card>
  );
}

CropCard.propTypes = {
  name: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(["easy", "intermediate", "advanced"]).isRequired,
  phRange: PropTypes.string.isRequired,
  growthCycle: PropTypes.string,
  description: PropTypes.string.isRequired,
  temperature: PropTypes.string,
  light: PropTypes.string,
};
