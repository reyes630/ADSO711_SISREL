const eventTypes_service = require('../services/eventTypesService');
const getAlleventTypes = async (req, res) => {
    const eventTypes = await eventTypes_service.getAlleventTypes();
    if (eventTypes)
        res.status(200).send({ "status": "OK", "message": "Tipo de evento", "data": eventTypes });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer el tipo de evento" });
};


const getOneEventTypes = async (req, res) => {
    const id = req.params.id;
    const eventTypes = await eventTypes_service.getOneEventTypes(id);
    if (eventTypes)
        res.status(200).send({ "status": "OK", "message": "Tipo de eventos", "data": eventTypes });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer el tipo de evento" });
};

const createEventTypes = async (req, res) => {
    const { body } = req;
    const createdeventType = await eventTypes_service.createEventTypes(body.eventType);
    if (createdeventType)
        res.status(200).send({ "status": "OK", "message": "Tipo de evento", "data": createdeventType });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al crear tipo de evento" });
}

const updateEventTypes = async (req, res) => {
    let id = req.params.id;
    let { eventType } = req.body;
    const updatedeventType = await eventTypes_service.updateEventTypes(id, eventType);
    if (updatedeventType)
        res.status(200).send({ "status": "OK", "message": "Tipo de evento actualizado", "data": updatedeventType });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar tipo de evento" });
};

const deleteEventTypes = async (req, res) => {
    let id = req.params.id;
    const deletedeventType = await eventTypes_service.deleteEventTypes(id);

    if (deletedeventType) 
        res.status(200).send({"status": "OK", "message": "Rol Eliminado", "data": deletedeventType});
    else 
    res.status(400).send({"status": "FAILED", "message": "Error al eliminar rol"});
};

module.exports = { getAlleventTypes, getOneEventTypes, createEventTypes, updateEventTypes, deleteEventTypes };