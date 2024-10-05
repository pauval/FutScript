const { getTeams, addTeam } = require('../db/consultas')

const obtenerEquipos = async (req, res) => {
    const equipos = await getTeams()
    res.json(equipos)
}

const agregarEquipo = async (req, res) => {
    const equipo = req.body
    await addTeam(equipo)
    res.send({ message: "Equipo agregado con éxito" })
}

module.exports = { obtenerEquipos, agregarEquipo }