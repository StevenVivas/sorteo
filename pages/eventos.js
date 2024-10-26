import { useEffect, useState } from 'react';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Inicializar como arreglo vacío
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // O el método que uses para obtener el token
      const res = await fetch('/api/auth', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setEventos(data.eventos);
        setUsuarios(data.usuarios || []); // Manejar caso donde 'usuarios' no esté definido
      } else {
        console.error('Error al obtener los datos');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Eventos</h2>
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id}> <p> </p> {evento.nombre} {evento.premios}  {evento.descripcion}</li>
        ))}
      </ul>

      <h2>Usuarios</h2>
      <ul>
        {usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <li key={usuario.id}>{`${usuario.nombre} ${usuario.apellidos} - ${usuario.correo} - ${usuario.celular} - ${usuario.codigo}`}</li>
          ))
        ) : (
          <li>No hay usuarios registrados.</li>
        )}
      </ul>
    </div>
  );
}
