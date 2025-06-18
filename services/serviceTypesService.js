const db = require('../models');

const getAllserviceTypes = async () => {
    try {
        const allRoles = await db.serviceType.findAll();
        return allRoles;
    } catch (error) {
        throw new Error(`Error al traer los roles: ${error.message}`);
    }
};

const getOneServiceTypes = async (id) => {
    try {
        const servicesTypes = await db.serviceType.findByPk(id);
        return servicesTypes;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

const createServiceTypes = async (serviceType) => {
    try {
        let newserviceType = await db.serviceType.create({
            serviceType,
        });
        return newserviceType;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

const updateServiceTypes = async (id, serviceType) => {
    try {
        await db.serviceType.update({
            serviceType,
        }, {
            where: { id },
        });
        return await db.serviceType.findByPk(id); // Obtener el tipo de servicio actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
};

const deleteServiceTypes = async (id) => {
    try {
        console.log(id);
        const deletedState = await db.serviceType.destroy({
            where: {
                id,
            }
        });
        return deletedState;
    } catch (error) {
        throw new Error(`Error al eliminar el tipo de servicio: ${error.message}`);
    }
};



module.exports = { getAllserviceTypes, getOneServiceTypes, createServiceTypes, updateServiceTypes, deleteServiceTypes };