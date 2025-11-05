// src/components/TicketForm.js
import React, { useState } from 'react';

function TicketForm({ onCrear }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [categoria, setCategoria] = useState('Soporte');
  const [asignado, setAsignado] = useState('');
  const [error, setError] = useState('');

  // Lista de correos reales de agentes del sistema
  const agentes = [
    "agente1@soporte360.com",
    "agente2@soporte360.com",
    "agente3@soporte360.com"
  ];

  const validarTexto = (texto) => /^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚ]+$/.test(texto);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim() || !asignado) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!validarTexto(titulo) || !validarTexto(descripcion)) {
      setError('Texto inválido. Solo letras, números y puntuación básica.');
      return;
    }

    onCrear({ titulo, descripcion, estado, categoria, asignado });
    setTitulo('');
    setDescripcion('');
    setEstado('Pendiente');
    setCategoria('Soporte');
    setAsignado('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
      <h2 className="mb-3">Crear Ticket</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Título</label>
        <input className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Estado</label>
        <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Resuelto">Resuelto</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="Soporte">Soporte</option>
          <option value="Desarrollo">Desarrollo</option>
          <option value="Mejora">Mejora</option>
          <option value="Bug">Bug</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Asignar a</label>
        <select className="form-select" value={asignado} onChange={(e) => setAsignado(e.target.value)}>
          <option value="">-- Selecciona un agente --</option>
          {agentes.map((email) => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Enviar</button>
    </form>
  );
}

export default TicketForm;
