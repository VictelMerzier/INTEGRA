import { obtenerTickets } from './ticketService';

// 1. Extraer todos los tickets de un usuario por estado
export const obtenerTicketsPorEstadoYUsuario = async (estado, correo) => {
  const tickets = await obtenerTickets();
  return tickets.filter(t => t.estado === estado && t.asignado === correo);
};

// 2. Extraer tickets dentro de un rango de fechas
export const obtenerTicketsPorRangoFecha = async (fechaInicio, fechaFin) => {
  const tickets = await obtenerTickets();
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  return tickets.filter(t => {
    const fecha = new Date(t.fechaCreacion);
    return fecha >= inicio && fecha <= fin;
  });
};

// 3. Desplegar resumen de tickets por estado
export const resumenPorEstado = async () => {
  const tickets = await obtenerTickets();
  const resumen = {};
  tickets.forEach(t => {
    resumen[t.estado] = (resumen[t.estado] || 0) + 1;
  });
  return resumen;
};
