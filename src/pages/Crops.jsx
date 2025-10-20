// pages/CultivosPage.jsx
import { Box, Container, Paper, Stack, Typography, Chip } from '@mui/material'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import GrassIcon from '@mui/icons-material/Grass'
import CropCard from '../components/CropCard'

const easyCrops = [
  {
    name: 'Lechuga',
    emoji: '🥬',
    difficulty: 'easy',
    phRange: '5.5–6.5',
    growthCycle: '30–45 días',
    description: 'Crece bien en casi cualquier sistema. Ideal para principiantes, produce hojas constantemente.',
  },
  {
    name: 'Espinaca',
    emoji: '🌿',
    difficulty: 'easy',
    phRange: '6.0–7.0',
    growthCycle: '40–50 días',
    description: 'Requiere temperaturas frescas. Muy nutritiva y fácil de cultivar en sistemas hidropónicos.',
    temperature: '15–20°C',
  },
  {
    name: 'Acelga',
    emoji: '🥬',
    difficulty: 'easy',
    phRange: '6.0–7.0',
    growthCycle: '50–60 días',
    description: 'Muy tolerante a variaciones. Produce hojas toda la temporada.',
  },
  {
    name: 'Albahaca',
    emoji: '🌿',
    difficulty: 'easy',
    phRange: '5.5–6.5',
    growthCycle: '25–40 días',
    description: 'Ideal para torres con buena luz solar. Aromática y perfecta para cocina.',
    light: 'Alta',
  },
  {
    name: 'Rúcula / Berro',
    emoji: '🌱',
    difficulty: 'easy',
    phRange: '6.0–7.0',
    growthCycle: '20–30 días',
    description: 'Crecen rápido y se pueden cosechar por cortes. Sabor picante característico.',
  },
]

const intermediateCrops = [
  {
    name: 'Fresas',
    emoji: '🍓',
    difficulty: 'intermediate',
    phRange: '5.8–6.5',
    growthCycle: '60–90 días',
    description: 'Muy populares en torres. Necesitan buena aireación y control preciso del pH.',
    light: 'Alta',
  },
  {
    name: 'Tomates Cherry',
    emoji: '🍅',
    difficulty: 'intermediate',
    phRange: '5.5–6.5',
    growthCycle: '60–80 días',
    description: 'Se adaptan bien pero necesitan soporte y más nutrientes. Producción abundante.',
    temperature: '20–25°C',
  },
  {
    name: 'Pimientos / Ajíes',
    emoji: '🌶️',
    difficulty: 'intermediate',
    phRange: '6.0–6.8',
    growthCycle: '70–90 días',
    description: 'Buen rendimiento con temperatura estable y buena luz. Requieren paciencia.',
    temperature: '22–28°C',
    light: 'Alta',
  },
  {
    name: 'Cebollín',
    emoji: '🧅',
    difficulty: 'intermediate',
    phRange: '6.0–7.0',
    growthCycle: '60–80 días',
    description: 'Raíz pequeña, ideal para orificios chicos en la torre. Sabor suave y versátil.',
  },
]

const advancedCrops = [
  {
    name: 'Frutilla Silvestre',
    emoji: '🍓',
    difficulty: 'advanced',
    phRange: '5.5–6.5',
    growthCycle: '90–120 días',
    description: 'Variedad más delicada que requiere control preciso de nutrientes y ambiente.',
    temperature: '18–24°C',
    light: 'Alta',
  },
  {
    name: 'Mini Pepinos',
    emoji: '🥒',
    difficulty: 'advanced',
    phRange: '5.5–6.0',
    growthCycle: '50–70 días',
    description: 'Requieren soporte vertical y control estricto de humedad. Alta producción.',
    temperature: '22–28°C',
  },
  {
    name: 'Melisa / Menta',
    emoji: '🌿',
    difficulty: 'advanced',
    phRange: '6.0–7.0',
    growthCycle: '60–90 días',
    description: 'Aromáticas invasivas que requieren control. Crecimiento vigoroso y constante.',
  },
  {
    name: 'Kale / Col Rizada',
    emoji: '🥬',
    difficulty: 'advanced',
    phRange: '6.0–7.5',
    growthCycle: '55–75 días',
    description: 'Requieren buena oxigenación y nutrientes constantes. Superfood muy nutritivo.',
    temperature: '15–20°C',
  },
]

function StickyHeader({ color, icon, title, subtitle }) {
  return (
    <Box sx={{ position: 'sticky', top: 16, zIndex: 1, pb: 1, bgcolor: 'background.default' }}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderColor: `${color}.main`,
          bgcolor: t => t.palette[color]?.light + '22',
        }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: t => t.palette[color]?.main + '22',
          }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: t => t.palette[color]?.main }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default function Crops() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          backdropFilter: 'blur(6px)',
        }}>
        <Container sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'grid',
                  placeItems: 'center',
                }}>
                <LocalFloristIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Cultivos y Consejos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Guía completa para tu torre hidropónica
                </Typography>
              </Box>
            </Box>

            {/* <Chip label="Catálogo de Cultivos" color="default" variant="outlined" /> */}
          </Box>
        </Container>
      </Box>

      {/* Main */}
      <Container sx={{ py: 0 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', my: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Descubre los mejores cultivos para tu sistema hidropónico. Haz click en cada cultivo para ver información
            detallada.
          </Typography>
        </Box>

        {/* Wrapper con altura fija para que cada columna scrollee de forma independiente */}
        <Box sx={{ height: { xs: 'auto', lg: 'calc(100vh - 180px)' } }}>
          {/* GRID FULL WIDTH */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
              gap: 3,
              alignItems: 'stretch',
              height: '100%',
            }}>
            {/* ===== FÁCILES ===== */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                overflowY: { xs: 'visible', lg: 'auto' },
                pr: 1,
                pb: 2,
                minWidth: 0,
                // evita que el primer card quede oculto bajo el header sticky
                scrollPaddingTop: '72px',
              }}>
              <StickyHeader
                color="success"
                icon={<GrassIcon fontSize="small" color="success" />}
                title="Fáciles"
                subtitle="Para empezar"
              />
              {/* Spacer para separar la primera card del header sticky */}
              <Box sx={{ height: 8 }} />
              {easyCrops.map(c => (
                <CropCard key={c.name} {...c} />
              ))}
            </Box>

            {/* ===== INTERMEDIOS ===== */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                overflowY: { xs: 'visible', lg: 'auto' },
                pr: 1,
                pb: 2,
                minWidth: 0,
                scrollPaddingTop: '72px',
              }}>
              <StickyHeader
                color="warning"
                icon={<TrendingUpIcon fontSize="small" color="warning" />}
                title="Intermedios"
                subtitle="Más control"
              />
              <Box sx={{ height: 8 }} />
              {intermediateCrops.map(c => (
                <CropCard key={c.name} {...c} />
              ))}
            </Box>

            {/* ===== AVANZADOS ===== */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                overflowY: { xs: 'visible', lg: 'auto' },
                pr: 1,
                pb: 2,
                minWidth: 0,
                scrollPaddingTop: '72px',
              }}>
              <StickyHeader
                color="error" // 🔴 rojizo para la 3ra columna
                icon={<EmojiObjectsIcon fontSize="small" color="error" />}
                title="Avanzados"
                subtitle="Expertos"
              />
              <Box sx={{ height: 8 }} />
              {advancedCrops.map(c => (
                <CropCard key={c.name} {...c} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Consejos */}
        <Paper
          variant="outlined"
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 2,
            borderColor: 'primary.main',
            bgcolor: t => t.palette.primary.light + '14',
          }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Consejos Generales
          </Typography>
          <Stack component="ul" spacing={1.2} sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Comienza con cultivos fáciles para familiarizarte con tu sistema antes de intentar cultivos más exigentes.
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Monitorea constantemente el pH y ajusta según el cultivo que estés desarrollando.
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              La temperatura y la luz son factores críticos. Asegúrate de que tu ubicación sea adecuada.
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Mantén un registro de tus cultivos para aprender qué funciona mejor en tu sistema específico.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
