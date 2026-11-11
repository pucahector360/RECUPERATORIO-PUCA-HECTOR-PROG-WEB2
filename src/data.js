const img = (t, c) =>
  `https://placehold.co/600x360/${c}/ffffff?text=${encodeURIComponent(t)}`

// Precios de referencia en USD. tier = potencia (0 a 4).
export const PCS = [
  { id: 1, nombre: 'Oficina Plus', cpu: 'Ryzen 5 5500', gpu: 'Gráficos integrados', ram: '16 GB', precio: 380, tier: 0, uso: 'Estudio y e-sports livianos', img: img('Oficina Plus', '4a4e69') },
  { id: 2, nombre: 'Entry 1080p', cpu: 'Ryzen 5 5500', gpu: 'GTX 1650 4GB', ram: '16 GB', precio: 520, tier: 1, uso: '1080p en medio/alto', img: img('Entry 1080p', '1b1f3b') },
  { id: 3, nombre: 'Mid 1080p Ultra', cpu: 'Ryzen 5 5600', gpu: 'RTX 3060 12GB', ram: '16 GB', precio: 780, tier: 2, uso: '1080p ultra, 1440p medio', img: img('Mid 1080p', '0f6f7a') },
  { id: 4, nombre: 'High 1440p', cpu: 'Ryzen 7 7700', gpu: 'RTX 4070 Super', ram: '32 GB', precio: 1500, tier: 3, uso: '1440p alto y ray tracing', img: img('High 1440p', 'b3173f') },
  { id: 5, nombre: 'Ultra 4K', cpu: 'Ryzen 7 9800X3D', gpu: 'RTX 5080', ram: '32 GB', precio: 2900, tier: 4, uso: '4K ultra', img: img('Ultra 4K', '3b2a7a') },
  { id: 6, nombre: 'Creator Max', cpu: 'Ryzen 9 9950X', gpu: 'RTX 5090', ram: '64 GB', precio: 4800, tier: 4, uso: '4K + edición y streaming', img: img('Creator Max', '14213d') },
]

// tier = nivel necesario para 1080p; +1 para 1440p y +2 para 4K (tope 4)
export const JUEGOS = [
  { keys: ['gta vi', 'gta 6', 'gta6'], nombre: 'GTA VI', tier: 3, nota: 'Todavía no hay requisitos oficiales para PC: es una estimación para un título muy exigente.' },
  { keys: ['gta v', 'gta 5', 'gtav', 'grand theft auto v'], nombre: 'GTA V', tier: 1, nota: 'Mínimo oficial: i5-3470 y GTX 660 con 8 GB de RAM. Recomendado: 16 GB de RAM.' },
  { keys: ['cyberpunk'], nombre: 'Cyberpunk 2077', tier: 3, nota: 'Con ray tracing pide una RTX de gama media-alta.' },
  { keys: ['red dead', 'rdr2'], nombre: 'Red Dead Redemption 2', tier: 2, nota: 'Recomendado: GTX 1060 6GB o superior y 12 GB de RAM.' },
  { keys: ['elden ring'], nombre: 'Elden Ring', tier: 2, nota: 'Recomendado: GTX 1060 o RX 580 y 12 GB de RAM.' },
  { keys: ['fortnite'], nombre: 'Fortnite', tier: 1, nota: 'Corre bien en gama de entrada; en competitivo conviene 144 Hz.' },
  { keys: ['valorant', 'cs2', 'counter'], nombre: 'Juegos e-sports', tier: 0, nota: 'Corren en casi cualquier equipo moderno.' },
  { keys: ['minecraft'], nombre: 'Minecraft', tier: 0, nota: 'Liviano; con shaders sube la exigencia a gama media.' },
]

export const DOLAR = 1200 // cotización de referencia USD→ARS


export const EMAIL_DESTINO = 'pucahector90@gmail.com'