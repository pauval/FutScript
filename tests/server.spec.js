const request = require('supertest');
const app = require('../index'); 

describe('GET /equipos', () => {
    it('Devuelve un array y un status code 200', async () => {
        const response = await request(app).get('/equipos').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('POST /login', () => {
    it('Devuelve un objeto con token al enviar credenciales correctas', async () => {
        const response = await request(app).post('/login').send({ username: 'admin', password: '1234' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('Devuelve un status 400 al enviar credenciales incorrectas', async () => {
        const response = await request(app).post('/login').send({ username: 'admin', password: 'wrong' });
        expect(response.statusCode).toBe(400);
    });
});


describe('POST /equipos/:teamID/jugadores', () => {
    it('Devuelve un status 201 al agregar un jugador con un token válido', async () => {
        const loginResponse = await request(app).post('/login').send({ username: 'admin', password: '1234' });
        const token = loginResponse.body.token;

        const equipoResponse = await request(app)
            .post('/equipos')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Equipo 1' });

        console.log(equipoResponse.body);  

        const teamID = equipoResponse.body.id;  

        const response = await request(app)
            .post(`/equipos/${teamID}/jugadores`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Jugador 1', position: 1 }); 

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', 'Jugador 1');
    });
});
