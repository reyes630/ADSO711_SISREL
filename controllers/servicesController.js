const services_service = require('../services/serviceService');
const getAllServices = async (req, res) => {
    const services = await services_service.getAllServices();
    if (services)
        res.status(200).send({ "status": "OK", "message": "Servicios", "data": services });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los servicios" });
};

const getOneServices = async (req, res) => {
    const id = req.params.id;
    const services = await services_service.getOneServices(id);
    if (services)
        res.status(200).send({ "status": "OK", "message": "Servicios", "data": services });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los servicios" });
};

const createService = async (req, res) => {
    const { body } = req;
    const createdService = await services_service.createService(body.service, body.color);
    if (createdService)
        res.status(200).send({ "status": "OK", "message": "Servicio", "data": createdService });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer servicio" });
}

const updateService = async (req, res) => {
    let id = req.params.id;
    let { service, color } = req.body;
    const updatedService = await services_service.updateService(id, service, color);
    if (updatedService)
        res.status(200).send({ "status": "OK", "message": "Servicio actualizado", "data": updatedService });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar servicio" });
};

const deleteService = async (req, res) => {
    let id = req.params.id;
    const deletedService = await services_service.deleteService(id);
    if (deletedService) 
        res.status(200).send({"status": "OK", "message": "Servicio Eliminado", "data": deletedService});
    else 
    res.status(400).send({"status": "FAILED", "message": "Error al eliminar el servicio"});
};

module.exports = { getAllServices, getOneServices, createService, updateService, deleteService };