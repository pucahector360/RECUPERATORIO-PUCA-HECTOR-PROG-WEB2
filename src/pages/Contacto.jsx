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
        "template_sg5iz55",   // Tu ID de plantilla real
        templateParams,
        "igH6bG0glDXnBTtbZ"   // Tu Clave pública
      )
      
      setEstado({ tipo: 'ok', texto: '✅ Mensaje enviado. La universidad te responderá pronto.' })
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
        <p className="hero-eyebrow">// Contacto Institucional</p>
        <h1>
          <span className="grad">Contacto UPATECo</span>
        </h1>
        <p className="sub">
          ¿Tenés alguna consulta sobre nuestras carreras, cursos o inscripciones? Escribinos y te responderemos a la brevedad.
        </p>
      </div>

      <div className="dos">
        <form onSubmit={enviar} noValidate className="contact-form">
          <label>
            Nombre y Apellido
            <input
              name="from_name"
              value={f.from_name}
              onChange={cambiar}
              aria-invalid={!!err.from_name}
              placeholder="Tu nombre completo"
            />
            {err.from_name && <small className="err">{err.from_name}</small>}
          </label>
          <label>
            Correo Electrónico
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
              placeholder="Quisiera consultar sobre..."
            />
            <small>
              {f.message.length}/{MAX}
            </small>
            {err.message && <small className="err"> {err.message}</small>}
          </label>

          {/* Campo Honeypot para evitar spam */}
          <input
            name="web"
            value={f.web}
            onChange={cambiar}
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden={true}
            style={{ display: 'none' }} // Oculto visualmente
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
          {/* MAPA REAL DE UPATECO */}
          <iframe
            title="Ubicación UPATECo"
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.816979470974!2d-65.40582642438505!3d-24.74561027804784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc1264c76c971%3A0x5fc7316c3bf2248!2sUPATecO%20-%20Universidad%20Provincial%20de%20Administraci%C3%B3n%2C%20Tecnolog%C3%ADa%20y%20Oficios!5e0!3m2!1ses!2sar!4v1710000000000!5m2!1ses!2sar"
            style={{ minHeight: '300px', flex: 1, borderRadius: '14px', border: 'none' }}
         />

          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>📍 Nuestra Ubicación</h3>
            <p className="meta" style={{ margin: '0 0 0.5rem 0', lineHeight: '1.6' }}>
              UPATECo<br />
              Ciudad Educativa<br />
              Av. Constitución Nacional s/n<br />
              Barrio Pereyra Rozas<br />
              Salta, Argentina
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}