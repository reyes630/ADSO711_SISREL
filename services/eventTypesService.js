const db = require('../models');

const getAlleventTypes = async () => {
    try {
        const eventTypes = await db.eventType.findAll();
        return eventTypes;
    } catch (error) {
        throw new Error(`Error al traer los tipos de evento: ${error.message}`);
    }
};

const getOneEventTypes = async (id) => {
    try {
        const eventType = await db.eventType.findByPk(id);
        return eventType;
    } catch (error) {
        throw new Error(`Error al traer el tipo de evento: ${error.message}`);
    }
};

const createEventTypes = async (eventType) => {
    try {
        let neweventTypes = await db.eventType.create({
            eventType,
        });
        return neweventTypes;
    } catch (error) {
        throw new Error(`Error al crear el tipo de evento: ${error.message}`);
    }
};

const updateEventTypes = async (id, eventType) => {
    try {
        await db.eventType.update({
            eventType,
        }, {
            where: { id },
        });
        return await db.eventType.findByPk(id); // Obtener el tipo de evento actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el tipo de evento: ${error.message}`);
    }
};

const deleteEventTypes = async (id) => {
    try {
        console.log(id)
        const deletedeventType = await db.eventType.destroy({
            where: {
                id,
            }
        });
        return deletedeventType;
    } catch (error) {
        throw new Error(`Error al eliminar el tipo de evento: ${error.message}`);
    }
};

module.exports = { getAlleventTypes, getOneEventTypes, createEventTypes, updateEventTypes, deleteEventTypes };