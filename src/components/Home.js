import React from 'react';
import Navbar from './Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h2>Bienvenido a Soporte360</h2>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
    </>
  );
}

export default Home;
