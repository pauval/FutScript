const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const pool = require('./db');  // Conexión a la base de datos
const { secretKey } = require('./utils');  // Clave secreta para JWT
const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores');
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos');

app.use(express.json());

const admin = { username: 'admin', password: '1234' };

// Ruta para login con generación de token JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === admin.username && password === admin.password) {
        const token = jwt.sign({ username }, secretKey);
        return res.json({ token });
    }
    return res.status(400).send('Credenciales incorrectas');
});



const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Dividir por 'Bearer '
    if (!token) return res.status(403).send('Se necesita un token');
    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).send('Token inválido');
    }
};


// Rutas existentes para obtener y registrar equipos y jugadores
app.get("/equipos", obtenerEquipos);
app.post("/equipos", verifyToken, agregarEquipo);  // Ahora requiere token JWT para agregar un equipo
app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post("/equipos/:teamID/jugadores", verifyToken, registrarJugador);  // Ahora requiere token JWT para agregar un jugador

// Servidor en ejecución
app.listen(3000, () => console.log('Server running on port 3000'));
