// pages/_app.js
import '../styles/global.css'; // Importa los estilos globales aquí

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
