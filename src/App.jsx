<<<<<<< HEAD
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Equipos from './pages/Equipos.jsx'
import Contacto from './pages/Contacto.jsx'
import ChatBot from './components/ChatBot.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="nav">
        <NavLink to="/" className="brand" aria-label="PC Gamer Store — inicio">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">
            PC GAMER <em>STORE</em>
          </span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>Ofertas</NavLink>
          <NavLink to="/equipos">PCs</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} PC Gamer Store · Hecho con ⚡ y React</p>
      </footer>
      <ChatBot />
    </div>
  )
}
=======
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
>>>>>>> 9958fde5ca68f47da9973e36b7bbd5d9e7749ad0
