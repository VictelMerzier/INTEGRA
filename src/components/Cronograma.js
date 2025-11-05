// src/components/Cronograma.js
import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { editarTicket } from '../services/ticketService';
import { resumenPorEstado } from '../services/ticketProcedures';

function Cronograma({ tickets = [], onEditar }) {
  const [resumen, setResumen] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    resumenPorEstado().then(data => {
      console.log("Resumen por estado:", data);
      setResumen(data);
    });
  }, []);

  const groups = [...new Set(tickets.map(t => t.asignado || 'Sin asignar'))].map((asignado, index) => ({
    id: index + 1,
    title: asignado
  }));

  const items = tickets.map((ticket) => {
    const groupId = groups.find(g => g.title === ticket.asignado)?.id || 1;
    return {
      id: ticket.id,
      group: groupId,
      title: `${ticket.titulo}`,
      start_time: moment(ticket.fechaCreacion),
      end_time: moment(ticket.fechaFin || ticket.fechaCreacion).add(2, 'days'),
      itemProps: {
        style: {
          background: ticket.estado === 'Resuelto' ? '#6c757d' : '#0d6efd',
          color: 'white',
          borderRadius: '6px',
          fontSize: '0.875rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          padding: '2px 6px'
        },
        onClick: () => setSelectedTicket(ticket),
        title: `${ticket.titulo} - ${ticket.descripcion}`
      }
    };
  });

  const handleItemMove = async (itemId, dragTime) => {
    const ticket = tickets.find(t => t.id === itemId);
    if (ticket) {
      const actualizado = {
        ...ticket,
        fechaCreacion: moment(dragTime).toISOString()
      };
      await editarTicket(ticket.id, actualizado);
      onEditar(actualizado);
    }
  };

  const handleItemResize = async (itemId, time, edge) => {
    const ticket = tickets.find(t => t.id === itemId);
    if (ticket) {
      let fechaCreacion = moment(ticket.fechaCreacion);
      let fechaFin = ticket.fechaFin ? moment(ticket.fechaFin) : moment(ticket.fechaCreacion).add(2, 'days');

      if (edge === 'left') {
        fechaCreacion = moment(time);
      } else if (edge === 'right') {
        fechaFin = moment(time);
      }

      const actualizado = {
        ...ticket,
        fechaCreacion: fechaCreacion.toISOString(),
        fechaFin: fechaFin.toISOString()
      };

      await editarTicket(ticket.id, actualizado);
      onEditar(actualizado);
    }
  };

  const resumenData = Object.entries(resumen).map(([estado, cantidad]) => ({
    estado,
    cantidad
  }));

  const handleEstadoChange = async (e) => {
    const actualizado = {
      ...selectedTicket,
      estado: e.target.value
    };
    await editarTicket(actualizado.id, actualizado);
    onEditar(actualizado);
    setSelectedTicket(null);
  };

  return (
    <div className="p-3 rounded shadow-sm" style={{ backgroundColor: '#e6f7ff' }}>
      <h4 className="mb-4 text-primary">Cronograma de Tickets</h4>

      <div className="mb-4 p-3 bg-white rounded shadow-sm">
        <h5 className="text-secondary mb-3">Resumen por Estado</h5>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={resumenData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="estado" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-3, 'days')}
        defaultTimeEnd={moment().add(7, 'days')}
        canMove
        canResize="both"
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        stackItems
        itemHeightRatio={0.9}
        lineHeight={60}
      />

      {selectedTicket && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Estado del Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedTicket(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>{selectedTicket.titulo}</strong></p>
                <p>{selectedTicket.descripcion}</p>
                <label htmlFor="estadoSelect" className="form-label">Estado</label>
                <select
                  id="estadoSelect"
                  className="form-select"
                  value={selectedTicket.estado}
                  onChange={handleEstadoChange}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cronograma;
