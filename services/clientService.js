const db = require('../models');

const getAllclient = async () => {
    try {
        const client = await db.Client.findAll();
        return client;
    } catch (error) {
        throw new Error(`Error al traer los clientes: ${error.message}`);
    }
};

const getOneclient = async (id) => {
    try {
        const client = await db.Client.findByPk(id);
        return client;
    } catch (error) {
        throw new Error(`Error al traer el cliente: ${error.message}`);
    }
};

const createclient = async (DocumentClient, NameClient, EmailClient, TelephoneClient) => {
    try {
        let newClient = await db.Client.create({
            DocumentClient,
            NameClient,
            EmailClient,
            TelephoneClient,
        });
        return newClient;
    } catch (error) {
        throw new Error(`Error al crear el cliente: ${error.message}`);
    }
};

const updateclient = async (id, DocumentClient, NameClient, EmailClient, TelephoneClient) => {
    try {
        await db.Client.update({
            DocumentClient,
            NameClient,
            EmailClient,
            TelephoneClient,
        }, {
            where: { id },
        });
        return await db.Client.findByPk(id); // Obtener el cliente actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el cliente: ${error.message}`);
    }
};

const deleteclient = async (id) => {
    try {
        console.log(id)
        const deletedclient = await db.Client.destroy({
            where: {
                id,
            }
        });
        return deletedclient;
    } catch (error) {
        throw new Error(`Error al eliminar el cliente: ${error.message}`);
    }
};

module.exports = { getAllclient, getOneclient, createclient, updateclient, deleteclient };