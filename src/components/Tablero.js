// src/components/Tablero.js
import React from 'react';
import { editarTicket } from '../services/ticketService';
import { FaEdit } from 'react-icons/fa';

function Tablero({ tickets = [], onEditar, onAbrirModalEditar }) {
  const estados = ['Pendiente', 'En progreso', 'Resuelto'];

  const handleDrop = async (e, nuevoEstado) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const ticket = tickets.find(t => t.id === id);
    if (ticket && ticket.estado !== nuevoEstado) {
      const actualizado = { ...ticket, estado: nuevoEstado };
      await editarTicket(id, actualizado);
      onEditar(actualizado);
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  return (
    <div className="kanban-container d-flex gap-4 p-3" style={{ minHeight: '80vh' }}>
      {estados.map((estado) => (
        <div
          key={estado}
          className="kanban-column bg-white border shadow-sm p-3 rounded"
          style={{ width: '100%' }}
          onDrop={(e) => handleDrop(e, estado)}
          onDragOver={allowDrop}
        >
          <h5 className="text-center text-primary">{estado}</h5>
          {tickets.filter((t) => t.estado === estado).map((ticket) => (
            <div
              key={ticket.id}
              className="card my-2"
              draggable
              onDragStart={(e) => handleDragStart(e, ticket.id)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="card-title text-dark">{ticket.titulo}</h6>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    title="Editar"
                    onClick={() => onAbrirModalEditar(ticket)}
                  >
                    <FaEdit />
                  </button>
                </div>
                <p className="card-text">
                  <small className="text-muted">{ticket.categoria}</small>
                </p>
                <p className="mb-0"><strong>Asignado:</strong> {ticket.asignado}</p>
                <p className="mb-0"><strong>Creado:</strong> {new Date(ticket.fechaCreacion).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Tablero;
