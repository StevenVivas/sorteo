// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia esto si usas otro usuario
  password: '', // Deja esto vacío si no tienes contraseña
  database: 'sorteo',
});

export default pool;
