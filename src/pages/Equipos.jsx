import { useMemo, useState } from 'react'
// Nota: Cambiamos los nombres de las importaciones para que coincidan con los cursos
import { CURSOS, DOLAR } from '../data.js' 

const AREAS = ['Todos', 'Tecnología', 'Oficios', 'Administración', 'Idiomas']
const MAX_DURACION = Math.max(...CURSOS.map(c => c.horas))

export default function Equipos() {
  const [areaIndex, setAreaIndex] = useState(-1) // -1 significa "Todos"
  const [maxHoras, setMaxHoras] = useState(MAX_DURACION)
  const [orden, setOrden] = useState('asc')
  // Mantenemos el dolar por si quieres mostrar un costo de matrícula o similar
  const [dolar, setDolar] = useState(DOLAR) 

  const lista = useMemo(
    () =>
      CURSOS.filter(c => (areaIndex < 0 || c.area === AREAS[areaIndex + 1]) && c.horas <= maxHoras).sort((a, b) =>
        orden === 'asc' ? a.horas - b.horas : b.horas - a.horas
      ),
    [areaIndex, maxHoras, orden]
  )

  return (
    <section className="page">
      <div className="page-head">
        <p className="hero-eyebrow">// Oferta Académica</p>
        <h1>
          Cursos y <span className="grad">Capacitaciones</span>
        </h1>
        <p className="sub">
          Formación gratuita y de calidad para potenciar tu futuro profesional. Filtrá por área y duración.
        </p>
      </div>

      {/* Filtros por Área */}
      <div className="chips" role="group" aria-label="Área de estudio">
        {AREAS.map((n, i) => (
          <button
            key={n}
            className={areaIndex === i - 1 ? 'chip on' : 'chip'}
            onClick={() => setAreaIndex(i - 1)}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Herramientas de Filtro */}
      <div className="tools">
        <label className="range-label">
          Duración máxima: <b>{maxHoras} horas</b>
          <input
            type="range"
            min="10"
            max={MAX_DURACION}
            step="10"
            value={maxHoras}
            onChange={e => setMaxHoras(+e.target.value)}
          />
        </label>
        {/* Dejamos el input del dólar por si decides mostrar algún costo administrativo */}
        <label>
          Cotización Dólar (ARS)
          <input
            type="number"
            value={dolar}
            onChange={e => setDolar(+e.target.value || 0)}
          />
        </label>
        <select value={orden} onChange={e => setOrden(e.target.value)} aria-label="Ordenar">
          <option value="asc">Menor duración</option>
          <option value="desc">Mayor duración</option>
        </select>
      </div>

      {/* Grilla de Cursos */}
      <div className="grid">
        {lista.map(curso => (
          <article className="card pc-card" key={curso.id}>
            <div className="card-img">
              <img src={curso.img} alt={curso.nombre} loading="lazy" />
            </div>
            <h3>{curso.nombre}</h3>
            <p className="meta">{curso.descripcionCorta}</p>
            
            <ul className="specs">
              <li><span>Área</span> {curso.area}</li>
              <li><span>Modalidad</span> {curso.modalidad}</li>
              <li><span>Duración</span> {curso.horas} hs</li>
            </ul>

            <div className="price-block">
              {/* Como UPATECO suele ser gratuito, mostramos "Gratuito" o el costo si lo hubiera */}
              <p className="price"><b>{curso.costo === 0 ? 'Gratuito' : `US$ ${curso.costo}`}</b></p>
              {curso.costo > 0 && (
                <p className="meta">≈ $ {(curso.costo * dolar).toLocaleString('es-AR')}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {!lista.length && (
        <p className="empty">
          No hay cursos que coincidan con esos filtros. Probá aumentando la duración máxima o cambiando el área.
        </p>
      )}
    </section>
  )
}