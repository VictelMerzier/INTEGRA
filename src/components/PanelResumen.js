// src/components/PanelResumen.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { FaCheckCircle, FaEdit, FaPlusSquare, FaClock } from 'react-icons/fa';

const PanelResumen = ({ tickets }) => {
  const ahora = new Date();
  const hace7Dias = new Date(ahora);
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  const proximos7Dias = new Date(ahora);
  proximos7Dias.setDate(proximos7Dias.getDate() + 7);

  const creadas = tickets.filter(t => new Date(t.fechaCreacion) >= hace7Dias).length;
  const finalizadas = tickets.filter(t => t.estado === 'finalizado' && new Date(t.fechaCreacion) >= hace7Dias).length;
  const actualizadas = 0; // A implementar
  const vencenPronto = tickets.filter(t => t.fechaLimite && new Date(t.fechaLimite) <= proximos7Dias).length;

  const contarPorEstado = (estado) => tickets.filter(t => t.estado === estado).length;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-3">
          <Card className="text-center shadow-sm">
            <CardBody>
              <FaCheckCircle className="text-success fs-3" />
              <CardTitle tag="h5" className="mt-2">{finalizadas} finalizadas</CardTitle>
              <CardText>en los últimos 7 días</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center shadow-sm">
            <CardBody>
              <FaEdit className="text-primary fs-3" />
              <CardTitle tag="h5" className="mt-2">{actualizadas} actualizadas</CardTitle>
              <CardText>en los últimos 7 días</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center shadow-sm">
            <CardBody>
              <FaPlusSquare className="text-info fs-3" />
              <CardTitle tag="h5" className="mt-2">{creadas} creadas</CardTitle>
              <CardText>en los últimos 7 días</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="text-center shadow-sm">
            <CardBody>
              <FaClock className="text-warning fs-3" />
              <CardTitle tag="h5" className="mt-2">{vencenPronto} vencen pronto</CardTitle>
              <CardText>en los próximos 7 días</CardText>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <Card className="h-100 shadow-sm">
            <CardBody>
              <CardTitle tag="h5">Resumen de estado</CardTitle>
              <CardText>Este resumen se actualizará automáticamente con los tickets del sistema.</CardText>
              <ul className="list-unstyled">
                <li className="text-primary">Oportunidad: {contarPorEstado('oportunidad')}</li>
                <li className="text-warning">En negociación: {contarPorEstado('negociacion')}</li>
                <li className="text-danger">Contactado: {contarPorEstado('contactado')}</li>
                <li className="text-muted">Perdido: {contarPorEstado('perdido')}</li>
                <li className="text-success">Ganado: {contarPorEstado('ganado')}</li>
              </ul>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="h-100 shadow-sm text-center">
            <CardBody>
              <CardTitle tag="h5">Aún no hay actividad</CardTitle>
              <CardText>
                Crea algunos tickets y asigna a tu equipo para comenzar a visualizar la actividad.
              </CardText>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PanelResumen;
