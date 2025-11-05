// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Calendario from './components/Calendario';
import PanelResumen from './components/PanelResumen';
import Tablero from './components/Tablero';
import Cronograma from './components/Cronograma';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  guardarTicket,
  obtenerTickets,
  eliminarTicket,
  editarTicket,
  buscarTickets,
  filtrarTicketsPorFecha
} from './services/ticketService';
import {
  FaGlobe, FaColumns, FaThList, FaCalendarAlt, FaRegClock,
  FaPaperclip, FaWpforms, FaFileAlt, FaTasks
} from 'react-icons/fa';

function App() {
  const { usuario, cerrarSesion } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [rolUsuario, setRolUsuario] = useState('administrador');
  const usuarioActual = usuario?.email || 'Usuario A';

  const cargarTickets = async () => {
    let data = await obtenerTickets();
    data = data.map(ticket => ({
      ...ticket,
      fechaCreacion: ticket.fechaCreacion || new Date().toISOString()
    }));
    setTickets(data);
  };

  useEffect(() => {
    if (usuario) cargarTickets();
  }, [usuario]);

  const agregarTicket = async (ticket) => {
    const nuevoTicket = {
      ...ticket,
      creadoPor: usuarioActual,
      fechaCreacion: new Date().toISOString()
    };
    try {
      await guardarTicket(nuevoTicket);
      cargarTickets();
    } catch (error) {
      alert("Error al guardar el ticket. Reintenta.");
    }
  };

  const eliminar = async (id) => {
    await eliminarTicket(id);
    cargarTickets();
  };

  const editar = async (ticket) => {
    await editarTicket(ticket.id, ticket);
    cargarTickets();
  };

  const buscar = async () => {
    if (busqueda.trim() === '') return cargarTickets();
    const resultados = await buscarTickets(busqueda);
    setTickets(resultados);
  };

  const filtrar = async (dias) => {
    const filtrados = await filtrarTicketsPorFecha(dias);
    setTickets(filtrados);
  };

  return (
    <Router>
      {!usuario ? (
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      ) : (
        <div className="bg-info-subtle min-vh-100">
          <div className="bg-white border-bottom py-3 px-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <span className="fw-bold text-primary fs-4">Soporte360</span>

              <div className="d-flex gap-2 align-items-center mx-auto">
                <div className="input-group shadow-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar en la lista"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <button className="btn btn-outline-primary" type="button" onClick={buscar}>Buscar</button>
                </div>
                {rolUsuario === 'administrador' && (
                  <button type="button" className="btn btn-primary shadow-sm px-4" onClick={() => setMostrarFormulario(true)}>
                    + Crear
                  </button>
                )}
              </div>
            </div>
          </div>

          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                <ul className="navbar-nav flex-wrap">
                  <li className="nav-item"><Link className="nav-link" to="/"><FaGlobe className="me-1" />Resumen</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/tablero"><FaColumns className="me-1" />Tablero</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/lista"><FaThList className="me-1" />Lista</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/calendario"><FaCalendarAlt className="me-1" />Calendario</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/cronograma"><FaRegClock className="me-1" />Cronograma</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/aprobaciones"><FaPaperclip className="me-1" />Aprobaciones</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/formularios"><FaWpforms className="me-1" />Formularios</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/paginas"><FaFileAlt className="me-1" />Páginas</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/actividades"><FaTasks className="me-1" />Actividades</Link></li>
                </ul>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select w-auto shadow-sm"
                    value={rolUsuario}
                    onChange={(e) => setRolUsuario(e.target.value)}
                  >
                    <option value="administrador">Administrador</option>
                    <option value="agente">Agente</option>
                    <option value="usuario">Usuario</option>
                  </select>
                  <button className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
              </div>
            </div>
          </nav>

          <div className={`modal fade ${mostrarFormulario ? 'show d-block' : ''}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Crear nuevo ticket</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarFormulario(false)}></button>
                </div>
                <div className="modal-body">
                  <TicketForm onCrear={(ticket) => {
                    agregarTicket(ticket);
                    setMostrarFormulario(false);
                  }} />
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid px-3 px-md-5">
            <Routes>
              <Route path="/" element={<PanelResumen tickets={tickets} />} />
              <Route path="/tablero" element={
                <Tablero
                  tickets={tickets}
                  onEditar={editar}
                  onAbrirModalEditar={(ticket) => {
                    console.log('Editar ticket desde el tablero:', ticket);
                  }}
                />
              } />
              <Route path="/calendario" element={<Calendario tickets={tickets} onEliminar={eliminar} onEditar={editar} onCrear={agregarTicket} />} />
              <Route path="/cronograma" element={<Cronograma tickets={tickets} onEditar={editar} />} />
              <Route path="/aprobaciones" element={<h3>Sección de Aprobaciones.</h3>} />
              <Route path="/formularios" element={<h3>Sección de Formularios.</h3>} />
              <Route path="/paginas" element={<h3>Páginas relacionadas (en desarrollo).</h3>} />
              <Route path="/actividades" element={<h3>Listado completo de actividades.</h3>} />
              <Route path="/lista" element={(<>
                <div className="mb-3">
                  <button className="btn btn-outline-secondary me-2" onClick={() => filtrar(7)}>Últimos 7 días</button>
                  <button className="btn btn-outline-secondary me-2" onClick={() => filtrar(30)}>Últimos 30 días</button>
                  <button className="btn btn-outline-primary" onClick={cargarTickets}>Ver Todos</button>
                </div>
                <TicketList
                  tickets={tickets}
                  onEliminar={eliminar}
                  onEditar={editar}
                  rolUsuario={rolUsuario}
                  usuarioActual={usuarioActual}
                />
              </>)} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
