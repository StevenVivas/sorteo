// pages/eventos.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Verificar el rol del usuario
        const response = await fetch('/api/auth', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al verificar el rol');
        }

        const userData = await response.json();
        setIsAdmin(userData.role === 'administrador');

        // Obtener eventos
        const responseEventos = await fetch('/api/eventos');
        if (!responseEventos.ok) throw new Error('Error al cargar eventos');
        const dataEventos = await responseEventos.json();
        setEventos(dataEventos);

        // Si es administrador, obtener todos los usuarios
        if (userData.role === 'administrador') {
          const responseUsuarios = await fetch('/api/usuarios'); // Asegúrate de tener esta API creada
          if (!responseUsuarios.ok) throw new Error('Error al cargar usuarios');
          const dataUsuarios = await responseUsuarios.json();
          setUsuarios(dataUsuarios);
        }
      } catch (err) {
        setError(err.message);
        if (err.message === 'Error al verificar el rol') {
          router.push('/login');
        }
      }
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <h1>Eventos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isAdmin && (
        <div>
          <h2>Usuarios</h2>
          <ul>
            {usuarios.map(usuario => (
              <li key={usuario.id}>
                {usuario.nombre} {usuario.apellidos} - {usuario.correo} - {usuario.rol}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2>Lista de Eventos</h2>
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>
            {evento.nombre} - {evento.fecha} - {evento.premios}
          </li>
        ))}
      </ul>
    </div>
  );
}
