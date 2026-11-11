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