import { useEffect, useRef, useState } from 'react'
import { JUEGOS, PCS } from '../data.js'

const env = import.meta.env
const RAWG = env.VITE_RAWG_KEY
const IA_PUBLICA_URL = 'https://chateverywhere.app'
const MODO = [RAWG && 'RAWG', 'IA Pública'].filter(Boolean).join(' + ')
const ORDENADAS = [...PCS].sort((a, b) => a.precio - b.precio)
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const SUGERENCIAS = ['GTA Vice City', 'Cyberpunk 2077', 'Elden Ring', 'Red Dead Redemption 2']

const SISTEMA = `Sos el asistente de "PC Gamer Store". Recibís la consulta del usuario y, cuando existan, los DATOS OFICIALES de RAWG con los requisitos mínimos y recomendados. Usá esos datos como única fuente de verdad: traducilos al español y resumilos (CPU, GPU, RAM, disco, SO). Después recomendá una PC del catálogo y explicá por qué. Si no hay datos, aclará que es una estimación y no inventes cifras. Respondé breve y con tono gamer. Catálogo (USD): ${JSON.stringify(PCS.map(({ nombre, cpu, gpu, ram, precio }) => ({ nombre, cpu, gpu, ram, precio })))}`

// ---------- 1) RAWG: Requisitos Reales ----------
const RELLENO = /\b(que|cuales?|requisitos?|requerimientos?|de|del|hardware|pc|para|jugar|correr|mover|necesito|necesita|quiero|en|con|el|la|los|las|un|una|minimos?|recomendados?|y|me|dame|dime|decime|sirve|tener|juego|se|puede|mi|si|otro|hardware|me|recomiendas|recomendas|pc|computadora)\b/g
const nombreJuego = txt => norm(txt)
  .replace(/\d[\d.,]*\s*(dolares?|usd|u\$s|us\$|\$)|\$\s*\d[\d.,]*/g, ' ')
  .replace(/\b(4k|2k|2160p?|1440p?|1080p?)\b/g, ' ')
  .replace(/[¿?¡!,.]/g, ' ').replace(RELLENO, ' ').replace(/\s+/g, ' ').trim()
const getJson = async u => { const r = await fetch(u); if (!r.ok) throw new Error('RAWG ' + r.status); return r.json() }

async function buscarRawg(txt, juegoGuardado) {
  let q = nombreJuego(txt)
  if (!q && juegoGuardado) q = norm(juegoGuardado)
  if (!q) return null
  
  const api = p => `https://rawg.io{p}${p.includes('?') ? '&' : '?'}key=${RAWG}`
  try {
    const lista = await getJson(api(`games?search=${encodeURIComponent(q)}&page_size=3`))
    for (const g of (lista.results || []).slice(0, 2)) {
      const d = await getJson(api(`games/${g.id}`))
      const pc = d.platforms?.find(p => p.platform.slug === 'pc')?.requirements
      if (pc?.minimum || pc?.recommended) return { nombre: d.name, slug: d.slug, min: pc.minimum, rec: pc.recommended }
    }
  } catch (e) {
    console.warn("Error buscando en RAWG:", e.message)
  }
  return null
}
const limpiar = s => (s || 'no informado').replace(/^(Minimum|Recommended):\s*/i, '').trim()
const formatear = d => `${d.nombre}: requisitos de PC (fuente RAWG, en inglés)\n\nMínimos:\n${limpiar(d.min)}\n\nRecomendados:\n${limpiar(d.rec)}`

// ---------- 2) IA Pública y Automática ----------
async function ia(historial, datos) {
  const ult = historial.length - 1
  const ultimoMensaje = historial[ult];
  let contenidoPrompt = ultimoMensaje.t;
  
  if (datos) {
    contenidoPrompt += `\n\nDATOS OFICIALES (RAWG) de "${datos.nombre}":\nMínimos: ${limpiar(datos.min)}\nRecomendados: ${limpiar(datos.rec)}`;
  }

  const r = await fetch(IA_PUBLICA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      model: { id: 'meta-llama/Meta-Llama-3-70B-Instruct-Lite', name: 'Llama 3 70B' },
      messages: [
        { role: 'user', content: `INSTRUCCIONES DE SISTEMA: ${SISTEMA}` },
        ...historial.map(m => ({ role: m.de === 'yo' ? 'user' : 'assistant', content: m.t }))
      ]
    }),
  })
  
  if (!r.ok) throw new Error('Servidor de IA pública no disponible ' + r.status)
  
  const data = await r.json()
  const texto = data.choices?.[0]?.message?.content?.trim()
  
  if (!texto) throw new Error('Respuesta vacía de la IA')
  return { texto, fuentes: [] }
}

// ---------- 3) Base Local con Memoria de Contexto ----------
function local(texto, juegoGuardado) {
  const t = norm(texto)
  let juego = JUEGOS.find(g => g.keys.some(k => new RegExp(`(^|\\W)${k}(\\W|$)`).test(t)))
  
  if (!juego && juegoGuardado) {
    juego = JUEGOS.find(g => norm(g.nombre) === norm(juegoGuardado) || g.keys.some(k => norm(k) === norm(juegoGuardado)))
  }

  if (!juego) return 'Ese juego no está en mi base local. Probá con GTA III, Vice City, San Andreas, GTA V, GTA VI, Cyberpunk, Red Dead, Elden Ring o Fortnite.'
  if (juego.retro) return `${juego.nombre}: ${juego.nota}\nCorre en cualquier PC actual, incluso la más económica del catálogo ("${ORDENADAS[0].nombre}", US$ ${ORDENADAS[0].precio}).`
  
  const res = /4k|2160/.test(t) ? 2 : /2k|1440/.test(t) ? 1 : 0
  const necesario = Math.min(4, juego.tier + res)
  const m = t.replace(/4k|2k|2160p?|1440p?|1080p?/g, '').match(/(\d[\d.,]*)/)
  const presu = m && +m[1].replace(/[.,]/g, '') >= 300 ? +m[1].replace(/[.,]/g, '') : null
  
  const alternativas = ORDENADAS.filter(p => p.tier >= necesario)
  const ideal = alternativas[0] || ORDENADAS[ORDENADAS.length - 1]
  const alternativaSecundaria = alternativas[1] || null
  const linea = p => `"${p.nombre}" (${p.cpu} + ${p.gpu}, ${p.ram}) a US$ ${p.precio}`
  
  let r = `${juego.nombre} en ${['1080p', '1440p', '4K'][res]}: ${juego.nota}\nNivel recomendado: ${necesario}/4. Te sirve ${linea(ideal)}.`
  
  if (t.includes('otro') || t.includes('otra')) {
    if (alternativaSecundaria) {
      r = `¡Claro! Otra excelente opción de hardware para ${juego.nombre} es la ${linea(alternativaSecundaria)}, que te dará un rendimiento más holgado.`
    } else {
      r = `Para ${juego.nombre} la configuración recomendada ideal es la ${linea(ideal)}. No contamos con otra variante superior en stock que se ajuste a ese nivel por ahora.`
    }
  }

  if (presu && presu < ideal.precio) {
    const posible = [...ORDENADAS].reverse().find(p => p.precio <= presu)
    r += posible ? `\nCon US$ ${presu} llegás a ${linea(posible)}, bajando detalles.` : `\nCon US$ ${presu} no alcanza; el mínimo del catálogo es US$ ${ORDENADAS[0].precio}.`
  } else if (presu && !t.includes('otro')) r += `\nTu presupuesto de US$ ${presu} alcanza.`
  
  return { respuesta: r, juegoDetectado: juego.nombre }
}

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false)
  const [msgs, setMsgs] = useState([{ de: 'bot', t: '¡Hola! Decime qué juego querés jugar y te digo qué hardware necesitás.' }])
  const [input, setInput] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [ultimoJuego, setUltimoJuego] = useState(null) 
  const fin = useRef(null)

  useEffect(() => { 
    const f = () => setAbierto(true)
    window.addEventListener('abrir-chat', f)
    return () => window.removeEventListener('abrir-chat', f) 
  }, [])

  useEffect(() => { fin.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, escribiendo, abierto])

  const preguntar = async txt => {
    if (!txt.trim() || escribiendo) return
    const nuevos = [...msgs, { de: 'yo', t: txt }]
    setMsgs(nuevos); setInput(''); setEscribiendo(true)
    
    const testLocal = JUEGOS.find(g => g.keys.some(k => new RegExp(`(^|\\W)${k}(\\W|$)`).test(norm(txt))))
    const juegoContexto = testLocal ? testLocal.nombre : ultimoJuego

    const datos = RAWG ? await buscarRawg(txt, juegoContexto).catch(e => { console.warn(e.message); return null }) : null
    const fuenteRawg = datos ? [{ uri: `https://rawg.io{datos.slug}`, title: 'RAWG' }] : []
    let r
    
    if (datos?.nombre) setUltimoJuego(datos.nombre)

    try {
      const { texto, fuentes } = await ia(nuevos.slice(1), datos)
      r = { de: 'bot', t: texto, fuentes: [...fuenteRawg, ...fuentes] }
    } catch (e) {
      console.warn('IA no disponible, usando sistema estático con memoria:', e.message)
      await new Promise(x => setTimeout(x, 400))
      
      if (datos) {
        r = { de: 'bot', t: formatear(datos), fuentes: fuenteRawg }
      } else {
        const resultadoLocal = local(txt, juegoContexto)
        if (typeof resultadoLocal === 'object') {
          r = { de: 'bot', t: resultadoLocal.respuesta }
          if (resultadoLocal.juegoDetectado) setUltimoJuego(resultadoLocal.juegoDetectado)
        } else {
          r = { de: 'bot', t: resultadoLocal }
        }
      }
    }
    
    setMsgs(m => [...m, r]); setEscribiendo(false)
  }

  return (
    <div className="chat">
      {abierto && (
        <div className="chat-box" role="dialog" aria-label="Asistente de PCs">
          <div className="chat-head"><span className="dot" />Asistente · {MODO}
            <button className="chat-close" onClick={() => setAbierto(false)} aria-label="Cerrar">✕</button>
          </div>
          <div className="chat-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-message ${m.de}`}>
                <p className="txt">{m.t}</p>
                {m.fuentes?.length > 0 && (
                  <div className="sources" style={{ marginTop: '6px', fontSize: '11px' }}>
                    <span style={{ opacity: 0.6 }}>Fuentes: </span>
                    {m.fuentes.map((f, fi) => (
                      <a key={fi} href={f.uri} target="_blank" rel="noreferrer" style={{ color: '#00bcd4', textDecoration: 'underline', marginLeft: '4px' }}>{f.title}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {escribiendo && <p className="bot typing">Pensando…</p>}
            <div ref={fin} />
          </div>
          <div className="chips small">
            {SUGERENCIAS.map(s => (
              <button key={s} className="chip" onClick={() => preguntar(s)}>{s}</button>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); preguntar(input) }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ej: GTA V o Cyberpunk..."
              aria-label="Tu consulta"
            />
          </form>
        </div>
      )}
      
      <button className="chat-toggle" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        {abierto ? '✕' : '💬'}
      </button>
    </div>
  )
}