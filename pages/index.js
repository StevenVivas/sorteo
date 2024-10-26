// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <h1>Bienvenido a la Página del Sorteo</h1>
      <p>Por favor, inicie sesión o regístrese.</p>
      <div className="links">
        <Link href="/login">
          <button>Iniciar Sesión</button>
        </Link>
        <span> | </span>
        <Link href="/register">
          <button>Registrarse</button>
        </Link>
      </div>
    </div>
  );
}
