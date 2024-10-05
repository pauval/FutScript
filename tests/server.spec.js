const request = require('supertest');
const app = require('../index');  // Asegúrate de que tu servidor está exportado

// Test para la ruta GET /equipos
describe('GET /equipos', () => {
    it('Debe devolver un array y un status code 200', async () => {
        const response = await request(app).get('/equipos').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

// Test para la ruta POST /login
describe('POST /login', () => {
    it('Debe devolver un objeto con token al enviar credenciales correctas', async () => {
        const response = await request(app).post('/login').send({ username: 'admin', password: '1234' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('Debe devolver un status 400 al enviar credenciales incorrectas', async () => {
        const response = await request(app).post('/login').send({ username: 'admin', password: 'wrong' });
        expect(response.statusCode).toBe(400);
    });
});

// Test para la ruta POST /equipos/:teamID/jugadores
describe('POST /equipos/:teamID/jugadores', () => {
    it('Debe devolver un status 201 al agregar un jugador con un token válido', async () => {
        const loginResponse = await request(app).post('/login').send({ username: 'admin', password: '1234' });
        const token = loginResponse.body.token;

        const response = await request(app)
            .post('/equipos/1/jugadores')
            .set('Authorization', token)
            .send({ name: 'Nuevo Jugador', position: 1 });
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', 'Nuevo Jugador');
    });
});
