require('dotenv').config();  // Cargar las variables del archivo .env
const { Pool } = require('pg');

// Configurar la conexión a la base de datos usando las variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
