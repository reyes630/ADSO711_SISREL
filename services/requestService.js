const db = require('../models');

const getAllrequest = async () => {
    try {
        const request = await db.request.findAll({
            include: [
                {
                    model: db.Client,   
                    attributes: ['id', 'NameClient'] 
                }
            ]
        });
        return request;
    } catch (error) {
        throw new Error(`Error al traer las solicitudes: ${error.message}`);
    }
};

const getOnerequest = async (id) => {
    try {
        const request = await db.request.findByPk(id, {
            include: [
                {
                    model: db.Client,
                    attributes: ['id', 'NameClient']
                }
            ]
        });
        return request;
    } catch (error) {
        throw new Error(`Error al traer la solicitud: ${error.message}`);
    }
};

const createrequest = async (eventDate, location, municipality, observations, comments, requestMethod, needDescription, assignment, FKstates, FKeventtypes, FKclients, FKusers, FKservicetypes, archive_status) => {
    try {
        let newrequest = await db.request.create({
            eventDate,
            location,
            municipality,
            observations,
            comments,
            requestMethod,
            needDescription,
            assignment,
            FKstates,        
            FKeventtypes,
            FKclients,
            FKusers,
            FKservicetypes,
            archive_status
        });
        return newrequest;
    } catch (error) {
        throw new Error(`Error al crear la solicitud: ${error.message}`);
    }
};

const updaterequest = async (id, eventDate, location, municipality, observations, comments, requestMethod, needDescription, assignment, FKstates, FKeventtypes, FKclients, FKusers, FKservicetypes, archive_status) => {
    try {
        await db.request.update({
            eventDate,
            location,
            municipality,
            observations,
            comments,
            requestMethod,
            needDescription,
            assignment,
            FKstates, 
            FKeventtypes, 
            FKclients, 
            FKusers, 
            FKservicetypes,
            archive_status
        }, {
            where: { id },
        });
        return await db.request.findByPk(id);
    } catch (error) {
        throw new Error(`Error al actualizar la solicitud: ${error.message}`);
    }
};

const deleterequest = async (id) => {
    try {
        const deletedrequest = await db.request.destroy({
            where: { id }
        });
        return deletedrequest;
    } catch (error) {
        throw new Error(`Error al eliminar la solicitud: ${error.message}`);
    }
};

module.exports = { getAllrequest, getOnerequest, createrequest, updaterequest, deleterequest };
