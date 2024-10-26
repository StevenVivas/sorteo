// pages/register.js (ejemplo)
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [codigo, setCodigo] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          nombre,
          apellidos,
          ciudad,
          correo,
          celular,
          contrasena,
          codigo,
        }),
      });

      const data = await response.json(); // Procesar respuesta como JSON

      if (!response.ok) {
        alert(data.message); // Mostrar alerta con el mensaje de error en JSON
        return;
      }

      alert('Registro exitoso');
      router.push('/login'); // Redirige al inicio de sesión
    } catch (err) {
      console.error('Error al registrarse:', err);
      alert('Error al registrarse. Inténtalo de nuevo.'); // Alerta de error general
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
      <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
      <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      <input type="text" placeholder="Celular" value={celular} onChange={(e) => setCelular(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
      <input type="text" placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
      <button type="submit">Registrarse</button>
    </form>
  );
}
