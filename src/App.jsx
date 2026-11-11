import Contacto from './components/Contacto.jsx'

export default function App() {
  return (
    <>
      <header className="cabecera">
        <div className="contenedor cabecera__interna">
          <span className="marca">UPATecO</span>
          <span className="marca__detalle">Universidad Provincial de Administración, Tecnología y Oficios</span>
        </div>
      </header>

      <main>
        <section className="presentacion contenedor">
          <h1>Escribinos y te respondemos por correo</h1>
          <p>
            Completá el formulario con tu consulta. También podés visitarnos: el
            mapa te muestra dónde está la universidad.
          </p>
        </section>

        <Contacto />
      </main>

      <footer className="pie">
        <div className="contenedor">
          <p>Programación Web II · Recuperatorio de TP final</p>
        </div>
      </footer>
    </>
  )
}
