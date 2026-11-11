import { useEffect, useMemo, useState } from 'react'

const URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=60&pageSize=30'

export default function Home() {
  const [juegos, setJuegos] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [q, setQ] = useState('')
  const [orden, setOrden] = useState('savings')
  const [favs, setFavs] = useState(new Set())
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 12000)
    setEstado('cargando')

    fetch(URL, { signal: ctl.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(d => {
        const limpio = d.map(j => ({
          ...j,
          salePrice: +j.salePrice,
          normalPrice: +j.normalPrice,
          savings: +j.savings,
          metacriticScore: +j.metacriticScore || 0,
        }))
        setJuegos(limpio)
        setEstado('ok')
      })
      .catch(e => { if (e.name !== 'AbortError') setEstado('error') })
      .finally(() => clearTimeout(timer))

    return () => { ctl.abort(); clearTimeout(timer) }
  }, [intento])

  const lista = useMemo(
    () =>
      juegos
        .filter(j => j.title.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) =>
          orden === 'title'
            ? a.title.localeCompare(b.title)
            : orden === 'price'
            ? a.salePrice - b.salePrice
            : b[orden] - a[orden]
        ),
    [juegos, q, orden]
  )

  const toggle = id =>
    setFavs(f => {
      const n = new Set(f)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-glow" />
        <p className="hero-eyebrow">// Ofertas en tiempo real · Steam</p>
        <h1>
          Encontrá tu próximo juego <br />
          <span className="grad">y la PC para correrlo</span>
        </h1>
        <p className="hero-sub">
          Ofertas reales de Steam en vivo. Si dudás si tu equipo lo aguanta, abrí el
          asistente. ¿Preferís algo gratis? Probá los clásicos en{' '}
          <a href="https://wasmarcade.com" target="_blank" rel="noreferrer">
            WASM Arcade
          </a>
          .
        </p>
        <div className="hero-tags">
          <span>🎮 +2000 juegos</span>
          <span>⚡ Precios reales</span>
          <span>🤖 Asistente IA</span>
        </div>
      </div>

      <div className="tools">
        <input
          type="search"
          placeholder="🔍 Buscar juego…"
          value={q}
          onChange={e => setQ(e.target.value)}
          aria-label="Buscar juego"
        />
        <select value={orden} onChange={e => setOrden(e.target.value)} aria-label="Ordenar">
          <option value="savings">Mayor descuento</option>
          <option value="price">Menor precio</option>
          <option value="metacriticScore">Mejor puntaje</option>
          <option value="title">A–Z</option>
        </select>
        <span className="count">
          {lista.length} juegos · {favs.size} favoritos
        </span>
      </div>

      {estado === 'error' && (
        <div className="alert err">
          No se pudo cargar la API.{' '}
          <button onClick={() => setIntento(i => i + 1)}>Reintentar</button>
        </div>
      )}

      <div className="grid">
        {estado === 'cargando' &&
          Array.from({ length: 8 }, (_, i) => <div key={i} className="card skel" />)}

        {lista.map(j => (
          <article className="card game-card" key={j.dealID}>
            <span className="badge">-{Math.round(j.savings)}%</span>
            <div className="card-img">
              <img src={j.thumb} alt={j.title} loading="lazy" />
            </div>
            <h3>{j.title}</h3>
            <p className="price">
              <s>US$ {j.normalPrice.toFixed(2)}</s>{' '}
              <b>US$ {j.salePrice.toFixed(2)}</b>
            </p>
            <p className="meta">Metacritic {j.metacriticScore || 's/d'}</p>
            <div className="row">
              <a
                href={`https://www.cheapshark.com/redirect?dealID=${j.dealID}`}
                target="_blank"
                rel="noreferrer"
                className="btn-link"
              >
                Ver oferta →
              </a>
              <button
                className={favs.has(j.dealID) ? 'fav on' : 'fav'}
                onClick={() => toggle(j.dealID)}
                aria-pressed={favs.has(j.dealID)}
              >
                {favs.has(j.dealID) ? '★' : '☆'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {estado === 'ok' && !lista.length && (
        <p className="empty">No hay resultados para "{q}". Probá con otro nombre.</p>
      )}
    </section>
  )
}