import { useMemo, useState } from 'react'
import { PCS, DOLAR } from '../data.js'

const NIVELES = ['Todos', 'Oficina', 'Entry', 'Mid', 'High', 'Ultra']
const MAX_PRECIO = Math.max(...PCS.map(p => p.precio))

export default function Equipos() {
  const [tier, setTier] = useState(-1)
  const [max, setMax] = useState(MAX_PRECIO)
  const [orden, setOrden] = useState('asc')
  const [dolar, setDolar] = useState(DOLAR)

  const lista = useMemo(
    () =>
      PCS.filter(p => (tier < 0 || p.tier === tier) && p.precio <= max).sort((a, b) =>
        orden === 'asc' ? a.precio - b.precio : b.precio - a.precio
      ),
    [tier, max, orden]
  )

  return (
    <section className="page">
      <div className="page-head">
        <p className="hero-eyebrow">// Catálogo</p>
        <h1>
          PCs de <span className="grad">escritorio</span>
        </h1>
        <p className="sub">
          Precios de referencia. Ajustá la cotización para ver el valor en pesos.
        </p>
      </div>

      <div className="chips" role="group" aria-label="Nivel">
        {NIVELES.map((n, i) => (
          <button
            key={n}
            className={tier === i - 1 ? 'chip on' : 'chip'}
            onClick={() => setTier(i - 1)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="tools">
        <label className="range-label">
          Presupuesto máximo: <b>US$ {max}</b>
          <input
            type="range"
            min="300"
            max={MAX_PRECIO}
            step="100"
            value={max}
            onChange={e => setMax(+e.target.value)}
          />
        </label>
        <label>
          Dólar (ARS)
          <input
            type="number"
            value={dolar}
            onChange={e => setDolar(+e.target.value || 0)}
          />
        </label>
        <select value={orden} onChange={e => setOrden(e.target.value)} aria-label="Ordenar">
          <option value="asc">Menor precio</option>
          <option value="desc">Mayor precio</option>
        </select>
      </div>

      <div className="grid">
        {lista.map(pc => (
          <article className="card pc-card" key={pc.id}>
            <div className="card-img">
              <img src={pc.img} alt={pc.nombre} loading="lazy" />
            </div>
            <h3>{pc.nombre}</h3>
            <p className="meta">{pc.uso}</p>
            <ul className="specs">
              <li><span>CPU</span> {pc.cpu}</li>
              <li><span>GPU</span> {pc.gpu}</li>
              <li><span>RAM</span> {pc.ram}</li>
            </ul>
            <div className="price-block">
              <p className="price"><b>US$ {pc.precio.toLocaleString('es-AR')}</b></p>
              <p className="meta">≈ $ {(pc.precio * dolar).toLocaleString('es-AR')}</p>
            </div>
          </article>
        ))}
      </div>

      {!lista.length && (
        <p className="empty">
          Ninguna PC cumple esos filtros. Subí el presupuesto o elegí otro nivel.
        </p>
      )}
    </section>
  )
}