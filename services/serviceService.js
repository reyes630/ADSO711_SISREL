const db = require('../models');

const getAllServices = async () => {
    try {
        const allServices = await db.service.findAll();
        return allServices;
    } catch (error) {
        throw new Error(`Error al traer los servicios: ${error.message}`);
    }
};

const getOneServices = async (id) => {
    try {
        const services = await db.service.findByPk(id);
        return services;
    } catch (error) {
        throw new Error(`Error al traer el servicio: ${error.message}`);
    }
};

const createService = async (service, color) => {
    try {
        let newService = await db.service.create({
            service,
            color,
        });
        return newService;
    } catch (error) {
        throw new Error(`Error al crear el servicio: ${error.message}`);
    }
};

const updateService = async (id, service, color) => {
    try {
        await db.service.update({
            service,
            color,
        }, {
            where: { id },
        });
        return await db.service.findByPk(id); // Obtener el servicio actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el servicio: ${error.message}`);
    }
};

const deleteService = async (id) => {
    try {
        console.log(id);
        const deletedService = await db.service.destroy({
            where: {
                id,
            }
        });
        return deletedService;
    } catch (error) {
        throw new Error(`Error al eliminar el servicio: ${error.message}`);
    }
};

module.exports = { getAllServices, getOneServices, createService, updateService, deleteService };