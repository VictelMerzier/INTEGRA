// src/components/ResetPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setError('Error al enviar el correo de recuperación.');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="mb-4 text-primary">Recuperar contraseña - Soporte360</h2>
      <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleReset}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">Enviar enlace</button>
      </form>

      <div className="mt-3 text-center">
        <Link to="/">Volver al inicio de sesión</Link>
      </div>
    </div>
  );
}

export default ResetPassword;
