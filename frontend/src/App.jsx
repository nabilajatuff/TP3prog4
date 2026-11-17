import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vehiculos, setVehiculos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    marca: '',
    modelo: '',
    patente: '',
    anio: '',
    capacidad_carga: ''
  });

  const API_URL = 'http://localhost:4000/api';

  useEffect(() => {
    if (token) {
      obtenerVehiculos(token);
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering ? { nombre, email, contraseña } : { email, contraseña };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ocurrió un error en la autenticación.');

      if (isRegistering) {
        setMensajeExito('¡Usuario registrado con éxito! Ahora podés iniciar sesión.');
        setIsRegistering(false);
        setContraseña('');
      } else {
        const jwtToken = data.token;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setVehiculos([]);
  };

  const obtenerVehiculos = async (tokenActual) => {
    try {
      const response = await fetch(`${API_URL}/vehiculos`, {
        headers: {
          'Authorization': `Bearer ${tokenActual || token}`
        }
      });
      if (!response.ok) throw new Error('Sesión expirada o token inválido.');
      const data = await response.json();
      setVehiculos(data);
      setError('');
    } catch (err) {
      setError(err.message);
      handleLogout();
    }
  };

  const handleInputChange = (e) => {
    setNuevoVehiculo({
      ...nuevoVehiculo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitVehiculo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/vehiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...nuevoVehiculo,
          anio: parseInt(nuevoVehiculo.anio),
          capacidad_carga: parseFloat(nuevoVehiculo.capacidad_carga)
        })
      });

      if (!response.ok) throw new Error('No se pudo registrar el vehículo.');
      
      setNuevoVehiculo({ marca: '', modelo: '', patente: '', anio: '', capacidad_carga: '' });
      obtenerVehiculos(token);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '4rem auto', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>{isRegistering ? 'Registrarse - UTN' : 'Iniciar Sesión - UTN'}</h2>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          {isRegistering ? 'Creá tu cuenta nueva para acceder al sistema:' : 'Ingresá con tu cuenta para acceder al sistema:'}
        </p>

        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        {mensajeExito && <div style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem' }}>{mensajeExito}</div>}

        <form onSubmit={handleAuth} style={{ display: 'grid', gap: '10px' }}>
          {isRegistering && (
            <input 
              type="text" 
              placeholder="Nombre y apellido" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              style={{ padding: '8px' }}
            />
          )}
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={contraseña} 
            onChange={(e) => setContraseña(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          {isRegistering ? '¿Ya tenés una cuenta?' : '¿No tenés usuario?'} {' '}
          <span 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); setMensajeExito(''); }} 
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegistering ? 'Iniciá sesión acá' : 'Registrate acá'}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Gestión de Transporte - UTN</h1>
        <button 
          onClick={handleLogout}
          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Cerrar Sesión
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ background: '#e9ecef', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3>Registrar Nuevo Vehículo</h3>
        <form onSubmit={handleSubmitVehiculo} style={{ display: 'grid', gap: '10px' }}>
          <input type="text" name="marca" placeholder="Marca (ej. Mercedes-Benz)" value={nuevoVehiculo.marca} onChange={handleInputChange} required />
          <input type="text" name="modelo" placeholder="Modelo (ej. Sprinter)" value={nuevoVehiculo.modelo} onChange={handleInputChange} required />
          <input type="text" name="patente" placeholder="Patente (ej. AB123CD)" value={nuevoVehiculo.patente} onChange={handleInputChange} required />
          <input type="number" name="anio" placeholder="Año (ej. 2023)" value={nuevoVehiculo.anio} onChange={handleInputChange} required />
          <input type="number" step="0.01" name="capacidad_carga" placeholder="Capacidad de carga (kg)" value={nuevoVehiculo.capacidad_carga} onChange={handleInputChange} required />
          <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
            Guardar Vehículo
          </button>
        </form>
      </div>

      <div>
        <h3>Lista de Vehículos Registrados</h3>
        {vehiculos.length === 0 ? (
          <p>No hay vehículos cargados todavía.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {vehiculos.map((v) => (
              <li key={v.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px', marginBottom: '8px', borderRadius: '4px' }}>
                <strong>{v.marca} {v.modelo}</strong> ({v.anio}) - Patente: <code>{v.patente}</code> | Carga: {v.capacidad_carga} kg
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;