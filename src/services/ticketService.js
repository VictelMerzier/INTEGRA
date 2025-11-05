// src/services/ticketService.js
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const TICKETS = 'tickets';

export const guardarTicket = async (ticket) => {
  await addDoc(collection(db, TICKETS), {
    ...ticket,
    fecha: new Date().toISOString()
  });
};

export const obtenerTickets = async () => {
  const q = query(collection(db, TICKETS), orderBy('fecha', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const eliminarTicket = async (id) => {
  await deleteDoc(doc(db, TICKETS, id));
};

export const editarTicket = async (id, nuevosDatos) => {
  const ref = doc(db, TICKETS, id);
  await updateDoc(ref, nuevosDatos);
};

export const buscarTickets = async (palabra) => {
  const tickets = await obtenerTickets();
  const texto = palabra.toLowerCase();
  return tickets.filter(t =>
    t.titulo.toLowerCase().includes(texto) ||
    t.descripcion.toLowerCase().includes(texto)
  );
};

export const filtrarTicketsPorFecha = async (dias) => {
  const tickets = await obtenerTickets();
  const ahora = new Date();
  const limite = new Date();
  limite.setDate(ahora.getDate() - dias);

  return tickets.filter(t => new Date(t.fecha) >= limite);
};
