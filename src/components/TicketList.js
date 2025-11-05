// src/components/TicketList.js
import React, { useState } from 'react';
import EditarTicketModal from './EditarTicketModal';

function TicketList({ tickets, onEliminar, onEditar, rolUsuario = 'administrador', usuarioActual = '' }) {
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const ticketsFiltrados = rolUsuario === 'agente'
    ? tickets.filter(ticket => ticket.asignado === usuarioActual)
    : rolUsuario === 'usuario'
    ? tickets.filter(ticket => ticket.creadoPor === usuarioActual)
    : tickets;

  const handleEditar = (ticket) => {
    if ((rolUsuario === 'agente' && ticket.asignado !== usuarioActual) || rolUsuario === 'usuario') return;
    setTicketSeleccionado(ticket);
    setMostrarModal(true);
  };

  const handleGuardar = async (datosEditados) => {
    const ticketActualizado = { ...ticketSeleccionado, ...datosEditados };
    await onEditar(ticketActualizado);
    setMostrarModal(false);
  };

  return (
    <div className="mt-4">
      <h2>Lista de Tickets</h2>
      {ticketsFiltrados.length === 0 ? (
        <p>No hay tickets disponibles para este usuario.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Tipo</th>
                <th>Clave</th>
                <th>Resumen</th>
                <th>Estado</th>
                <th>Comentarios</th>
                <th>Categoría</th>
                <th>Asignado</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ticketsFiltrados.map((ticket, index) => (
                <tr key={ticket.id || index}>
                  <td>General</td>
                  <td>TCK-{index + 1}</td>
                  <td><strong>{ticket.titulo}</strong><br />{ticket.descripcion}</td>
                  <td>{ticket.estado}</td>
                  <td>0</td>
                  <td>{ticket.categoria}</td>
                  <td>{ticket.asignado}</td>
                  <td>{new Date(ticket.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    {(rolUsuario === 'administrador') || (rolUsuario === 'agente' && ticket.asignado === usuarioActual) ? (
                      <>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(ticket)}>Editar</button>
                        {rolUsuario === 'administrador' && (
                          <button className="btn btn-sm btn-danger" onClick={() => onEliminar(ticket.id)}>Eliminar</button>
                        )}
                      </>
                    ) : <span className="text-muted">Sin permisos</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ticketSeleccionado && (
        <EditarTicketModal
          mostrar={mostrarModal}
          ticket={ticketSeleccionado}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
}

export default TicketList;
