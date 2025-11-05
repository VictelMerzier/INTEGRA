import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { cerrarSesion, usuario } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <span className="navbar-brand">Soporte360</span>
      <div className="ms-auto d-flex align-items-center gap-2">
        <span className="text-white me-2">Hola, {usuario?.email}</span>
        <button onClick={cerrarSesion} className="btn btn-outline-light btn-sm">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
