const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const app = express();
const { secretKey } = require('./utils');  

app.use(express.json());

const admin = { username: 'admin', password: '1234' };

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === admin.username && password === admin.password) {
        const token = jwt.sign({ username }, secretKey);
        return res.json({ token });
    }
    return res.status(400).send('Credenciales incorrectas');
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).send('Se necesita un token');
    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).send('Token inválido');
    }
};

// Rutas
app.get('/equipos', async (req, res) => {
    const result = await pool.query('SELECT * FROM equipos');
    return res.json(result.rows);
});

app.get('/equipos/:teamID/jugadores', async (req, res) => {
    const { teamID } = req.params;
    const result = await pool.query(`
        SELECT j.name, p.name AS posicion 
        FROM jugadores j 
        INNER JOIN posiciones p ON j.position = p.id 
        WHERE j.id_equipo = $1
    `, [teamID]);
    return res.json(result.rows);
});

app.post('/equipos', verifyToken, async (req, res) => {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO equipos (name) VALUES ($1) RETURNING *', [name]);
    return res.status(201).json(result.rows[0]);
});

app.post('/equipos/:teamID/jugadores', verifyToken, async (req, res) => {
    const { teamID } = req.params;
    const { name, position } = req.body;
    const result = await pool.query(
        'INSERT INTO jugadores (id_equipo, name, position) VALUES ($1, $2, $3) RETURNING *',
        [teamID, name, position]
    );
    return res.status(201).json(result.rows[0]);
});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => console.log('Server running on port 3000'));
}
