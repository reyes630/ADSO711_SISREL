const serviceTypes_service = require('../services/serviceTypesService');
const getAllserviceTypes = async (req, res) => {
    const servicesTypes = await serviceTypes_service.getAllserviceTypes();
    if (servicesTypes)
        res.status(200).send({ "status": "OK", "message": "Tipos de servicio", "data": servicesTypes });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los tipos de servicios" });
};

const getOneServiceTypes = async (req, res) => {
    const id = req.params.id;
    const servicesTypes = await serviceTypes_service.getOneServiceTypes(id);
    if (servicesTypes)
        res.status(200).send({ "status": "OK", "message": "Tipos de servicio", "data": servicesTypes });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los tipos de servicio" });
};

const createServiceTypes = async (req, res) => {
    const { body } = req;
    const createdServiceType = await serviceTypes_service.createServiceTypes(body.serviceType);
    if (createdServiceType)
        res.status(200).send({ "status": "OK", "message": "Rol", "data": createdServiceType });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al tarer usuario" });
}


const updateServiceTypes = async (req, res) => {
    let id = req.params.id;
    let { serviceType } = req.body;
    const updatedServiceType = await serviceTypes_service.updateServiceTypes(id, serviceType);
    if (updatedServiceType)
        res.status(200).send({ "status": "OK", "message": "Usuario actualizado", "data": updatedServiceType });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar usuario" });
};

const deleteServiceTypes = async (req, res) => {
    let id = req.params.id;
    const deletedServiceTypes = await serviceTypes_service.deleteServiceTypes(id);
    if (deletedServiceTypes) 
        res.status(200).send({"status": "OK", "message": "Tipo de servicio Eliminado", "data": deletedServiceTypes});
    else 
    res.status(400).send({"status": "FAILED", "message": "Error al eliminar el tipo de servicio"});
};

module.exports = { getAllserviceTypes, getOneServiceTypes, createServiceTypes, updateServiceTypes, deleteServiceTypes };