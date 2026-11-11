import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// Ubicación de UPATecO (coordenadas tomadas del enlace de Google Maps)
const LAT = -24.7456103
const LNG = -65.4032515
const MAPA_URL = `https://maps.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`

export default function Contacto() {
  const formulario = useRef(null)
  const [estado, setEstado] = useState('inactivo') // inactivo | enviando | enviado | error

  const enviar = async (e) => {
    e.preventDefault()
    setEstado('enviando')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formulario.current, {
        publicKey: PUBLIC_KEY,
      })
      setEstado('enviado')
      formulario.current.reset()
    } catch (error) {
      console.error('Error de EmailJS:', error)
      setEstado('error')
    }
  }

  return (
    <section className="contacto contenedor" aria-labelledby="titulo-contacto">
      <form ref={formulario} onSubmit={enviar} className="formulario">
        <h2 id="titulo-contacto">Formulario de contacto</h2>

        <label htmlFor="nombre">Nombre y apellido</label>
        <input id="nombre" name="from_name" type="text" required autoComplete="name" />

        <label htmlFor="email">Tu correo electrónico</label>
        <input id="email" name="reply_to" type="email" required autoComplete="email" />

        <label htmlFor="asunto">Asunto</label>
        <input id="asunto" name="subject" type="text" required />

        <label htmlFor="mensaje">Mensaje</label>
        <textarea id="mensaje" name="message" rows="5" required />

        <button type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
        </button>

        <p className={`aviso aviso--${estado}`} role="status" aria-live="polite">
          {estado === 'enviado' && 'Mensaje enviado. Te responderemos a tu correo.'}
          {estado === 'error' && 'No se pudo enviar el mensaje. Revisá tu conexión e intentá de nuevo.'}
        </p>
      </form>

      <div className="mapa">
        <iframe
          title="Mapa con la ubicación de UPATecO"
          src={MAPA_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  )
}
