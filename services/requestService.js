const db = require('../models');
const notificationService = require('./notificationService');

const getAllrequest = async () => {
  try {
    const request = await db.request.findAll({
      include: [
        {
          model: db.Client,
          attributes: ['id', 'NameClient']
        },
        {
          model: db.State,
          attributes: ['id', 'State', 'color', 'Description']
        },
        {
          model: db.serviceType,
          attributes: ['id', 'serviceType'],
          include: [
            {
              model: db.service,
              attributes: ['id', 'service', 'color']
            }
          ]
        },
        {
          model: db.user, 
          attributes: ['id', 'nameUser', 'emailUser']
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
        },
        {
          model: db.State,
          attributes: ['id', 'State', 'color', 'Description']
        },
        {
          model: db.serviceType,
          attributes: ['id', 'serviceType'],
          include: [
            {
              model: db.service,
              attributes: ['id', 'service', 'color']
            }
          ]
        },
        {
          model: db.user, 
          attributes: ['id', 'nameUser', 'emailUser']
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

        // Obtener la solicitud con sus relaciones para la notificación
        const requestWithRelations = await db.request.findByPk(newrequest.id, {
            include: [
                {
                    model: db.Client,
                    attributes: ['id', 'NameClient']
                },
                {
                    model: db.State,
                    attributes: ['id', 'State']
                },
                {
                    model: db.serviceType,
                    attributes: ['id', 'serviceType']
                }
            ]
        });

        // Enviar notificación a coordinadores
        await notificationService.notifyCoordinators(requestWithRelations);

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
