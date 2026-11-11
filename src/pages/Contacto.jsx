import { useState } from 'react'
import emailjs from '@emailjs/browser'

const vacio = { from_name: '', reply_to: '', message: '', web: '' }
const MAX = 500

export default function Contacto() {
  const [f, setF] = useState(vacio)
  const [err, setErr] = useState({})
  const [estado, setEstado] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setF({ ...f, [e.target.name]: e.target.value })

  const validar = () => {
    const e = {}
    if (f.from_name.trim().length < 2) e.from_name = 'Escribí tu nombre.'
    if (!/^\S+@\S+\.\S+$/.test(f.reply_to)) e.reply_to = 'Ingresá un email válido.'
    if (f.message.trim().length < 10) e.message = 'El mensaje debe tener al menos 10 caracteres.'
    setErr(e)
    return !Object.keys(e).length
  }

  const enviar = async ev => {
    ev.preventDefault()
    if (f.web || !validar()) return
    setEnviando(true)
    setEstado({ tipo: '', texto: '' })
    
    try {
      // Estructuramos los datos vinculados a las etiquetas {{nombre}} y {{mensaje}} de tu panel
      const templateParams = {
        nombre: f.from_name,    
        mensaje: f.message,     
        reply_to: f.reply_to    
      }
      
      // 🔥 SOLUCIÓN REAL: Inyectamos tus identificadores directamente como texto
      await emailjs.send(
        "service_e531tpb",    // Tu ID de servicio
        "template_sg5iz55",   // Tu ID de plantilla real de la captura
        templateParams,
        "igH6bG0glDXnBTtbZ"   // Tu Clave pública
      )
      
      setEstado({ tipo: 'ok', texto: '✅ Mensaje enviado. Te respondemos pronto.' })
      setF(vacio)
    } catch (e) {
      console.error('EmailJS error detallado:', e)
      setEstado({
        tipo: 'err',
        texto: `❌ No se pudo enviar: ${e?.text || 'Revisá tus claves o tu conexión.'}`,
      })
    }
    setEnviando(false)
  }

  return (
    <section className="page">
      <div className="page-head">
        <p className="hero-eyebrow">// Hablemos</p>
        <h1>
          <span className="grad">Contacto</span>
        </h1>
        <p className="sub">
          Contanos qué build tenés en mente o qué juego querés correr. Te respondemos a la brevedad.
        </p>
      </div>

      <div className="dos">
        <form onSubmit={enviar} noValidate className="contact-form">
          <label>
            Nombre
            <input
              name="from_name"
              value={f.from_name}
              onChange={cambiar}
              aria-invalid={!!err.from_name}
              placeholder="Tu nombre"
            />
            {err.from_name && <small className="err">{err.from_name}</small>}
          </label>
          <label>
            Email
            <input
              type="email"
              name="reply_to"
              value={f.reply_to}
              onChange={cambiar}
              aria-invalid={!!err.reply_to}
              placeholder="tu@email.com"
            />
            {err.reply_to && <small className="err">{err.reply_to}</small>}
          </label>
          <label>
            Mensaje
            <textarea
              name="message"
              rows="6"
              maxLength={MAX}
              value={f.message}
              onChange={cambiar}
              aria-invalid={!!err.message}
              placeholder="Quiero una PC para jugar…"
            />
            <small>
              {f.message.length}/{MAX}
            </small>
            {err.message && <small className="err"> {err.message}</small>}
          </label>

          <input
            name="web"
            value={f.web}
            onChange={cambiar}
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden={true}
          />

          <button type="submit" disabled={enviando} className="btn-primary">
            {enviando ? 'Enviando…' : 'Enviar mensaje →'}
          </button>
          
          {estado.texto && (
            <p role="status" className={`status ${estado.tipo}`}>
              {estado.texto}
            </p>
          )}
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <iframe
            title="Ubicación de HRP Informática"
            loading="lazy"
            src="https://google.com"
            style={{ minHeight: '300px', flex: 1, borderRadius: '14px', border: 'none' }}
         />

          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>📍 Nuestra Ubicación</h3>
            <p className="meta" style={{ margin: '0 0 0.5rem 0', lineHeight: '1.6' }}>
              San Antonio de los Cobres<br />
              Calle Las Palmeritas s/n<br />
              HRP Informática<br />
              CP 4411<br />
              Salta, Argentina
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
