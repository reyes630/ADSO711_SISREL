
const db = require('../models');

const getAllStates = async () => {
    try {
        const allStates = await db.State.findAll();
        return allStates;
    } catch (error) {
        throw new Error(`Error al traer los estados ${error.message}`);
    }
};

const getOneStates = async (id) => {
    try {
        const state = await db.State.findByPk(id);
        return state;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

const createState = async (State, Description, color) => {
    try {
        let newState = await db.State.create({
            State,
            Description,
            color,
        });
        return newState;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

const updateState = async (id, State, Description, color) => {
    try {
        await db.State.update({
            State,
            Description,
            color,
        }, {
            where: { id },
        });
        return await db.State.findByPk(id); // Obtener el estado actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
};

const deleteStates = async (id) => {
    try {
        console.log(id)
        const deletedState = await db.State.destroy({
            where: {
                id,
            }
        });
        return deleteStates;
    } catch (error) {
        throw new Error(`Error al traer el usuario ${error.message}`);
    }
};


module.exports = { getAllStates, getOneStates, createState, updateState, deleteStates };