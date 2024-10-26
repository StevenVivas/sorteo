// pages/api/auth.js
import db from '../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, apellidos, ciudad, correo, celular, contrasena, codigo } = req.body;

    // Registro de usuario
    if (req.body.action === 'register') {
      // Validar el rango del código
      const codigoNum = parseInt(codigo, 10);
      if (isNaN(codigoNum) || codigoNum < 11111 || codigoNum > 99999) {
        res.status(400).end('El código debe estar entre 11111 y 99999.'); // Mensaje simple
        return;
      }

      try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const [result] = await db.query(
          'INSERT INTO usuarios (nombre, apellidos, ciudad, correo, celular, contrasena, rol, codigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [nombre, apellidos, ciudad, correo, celular, hashedPassword, 'usuario', codigo]
        );
        return res.status(201).json({ message: 'Usuario registrado', userId: result.insertId });
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).end('Error al registrar el usuario.'); // Mensaje simple
      }
    }

    // Login de usuario
    if (req.body.action === 'login') {
      const [usuarios] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
      const usuario = usuarios[0];

      if (usuario && await bcrypt.compare(contrasena, usuario.contrasena)) {
        const token = jwt.sign({ userId: usuario.id, role: usuario.rol }, 'tu_clave_secreta', { expiresIn: '1h' });
        return res.status(200).json({ token });
      }
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } else if (req.method === 'GET') {
    // Endpoint para obtener todos los eventos
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const token = authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'tu_clave_secreta');
      
      // Obtenemos los eventos para ambos roles
      const [eventos] = await db.query('SELECT * FROM eventos');

      if (decoded.role === 'administrador') {
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        return res.status(200).json({ usuarios, eventos });
      } else if (decoded.role === 'usuario') {
        return res.status(200).json({ eventos });
      }
      return res.status(403).json({ message: 'Acceso denegado' });
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
