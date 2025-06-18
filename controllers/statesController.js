const states_service = require('../services/statesService');
const getAllStates = async (req, res) => {
    const states = await states_service.getAllStates();
    if (states)
        res.status(200).send({ "status": "OK", "message": "Estado", "data": states });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los usuarios" });
};

const getOneStates = async (req, res) => {
    const id = req.params.id;
    const state = await states_service.getOneStates(id);
    if (state)
        res.status(200).send({ "status": "OK", "message": "Estado", "data": state });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer el estado" });
};

const createState = async (req, res) => {
    const { body } = req;
    const createdState = await states_service.createState(body.State, body.Description);
    if (createdState)
        res.status(200).send({ "status": "OK", "message": "Estado", "data": createdState });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al crear el estado" });
};

const updateState = async (req, res) => {
    let id = req.params.id;
    let { State, Description } = req.body;
    const updatedState = await states_service.updateState(id, State, Description);
    if (updatedState)
        res.status(200).send({ "status": "OK", "message": "Usuario actualizado", "data": updatedState });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar usuario" });
};

const deleteStates = async (req, res) => {
    let id = req.params.id;
    const deletedState = await states_service.deleteStates(id);
    if (deletedState) 
        res.status(200).send({ "status": "OK", "message": "Estado Eliminado" });
    else 
        res.status(400).send({ "status": "FAILED", "message": "Error al eliminar estado" });
};

module.exports = { getAllStates, getOneStates, createState, updateState, deleteStates };