// src/components/EditarTicketModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EditarTicketModal({ mostrar, ticket, onCerrar, onGuardar }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');
  const [categoria, setCategoria] = useState('');
  const [asignado, setAsignado] = useState('');

  useEffect(() => {
    if (ticket) {
      setTitulo(ticket.titulo || '');
      setDescripcion(ticket.descripcion || '');
      setEstado(ticket.estado || '');
      setCategoria(ticket.categoria || '');
      setAsignado(ticket.asignado || '');
    }
  }, [ticket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({ titulo, descripcion, estado, categoria, asignado });
  };

  return (
    <Modal show={mostrar} onHide={onCerrar}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ticket</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Resuelto">Resuelto</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Asignado a</Form.Label>
            <Form.Control value={asignado} onChange={(e) => setAsignado(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>Cancelar</Button>
          <Button type="submit" variant="primary">Guardar cambios</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditarTicketModal;
