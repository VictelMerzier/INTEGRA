// src/components/Calendario.js
import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import EditarTicketModal from './EditarTicketModal';
import TicketForm from './TicketForm';

const Calendario = ({ tickets, onEliminar, onEditar, onCrear }) => {
  const calendarRef = useRef(null);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const eventos = tickets.map((ticket, index) => ({
    id: ticket.id || index.toString(),
    title: ticket.titulo,
    start: ticket.fechaCreacion,
    extendedProps: { ticket }
  }));

  const manejarClick = (info) => {
    const ticket = info.event.extendedProps.ticket;
    if (!ticket) return;
    setTicketSeleccionado(ticket);
    setMostrarModal(true);
  };

  const handleEditar = (datosEditados) => {
    onEditar({ ...ticketSeleccionado, ...datosEditados });
    setMostrarModal(false);
  };

  const handleDateClick = (info) => {
    setFechaSeleccionada(info.dateStr);
    setMostrarFormulario(true);
  };

  const handleCrear = (nuevoTicket) => {
    onCrear({ ...nuevoTicket, fechaCreacion: fechaSeleccionada });
    setMostrarFormulario(false);
  };

  const handleEventDrop = async (info) => {
    const ticket = info.event.extendedProps.ticket;
    const nuevaFecha = info.event.startStr;
    if (ticket && ticket.id) {
      const actualizado = { ...ticket, fechaCreacion: nuevaFecha };
      await onEditar(actualizado);
    }
  };

  return (
    <div className="bg-light p-3 rounded shadow">
      <p className="text-muted">.</p>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={eventos}
        ref={calendarRef}
        height="auto"
        editable={true}
        droppable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        eventClick={manejarClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
      />

      {ticketSeleccionado && (
        <EditarTicketModal
          mostrar={mostrarModal}
          ticket={ticketSeleccionado}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleEditar}
        />
      )}

      {mostrarFormulario && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Nuevo ticket para {fechaSeleccionada}</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarFormulario(false)}></button>
              </div>
              <div className="modal-body">
                <TicketForm onCrear={handleCrear} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
