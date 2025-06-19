const clients_service = require('../services/clientService');
const getAllclient = async (req, res) => {
    const client = await clients_service.getAllclient();
    if (client)
        res.status(200).send({ "status": "OK", "message": "Clientes", "data": client });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los clientes" });
};

const getOneclient = async (req, res) => {
    const id = req.params.id;
    const client = await clients_service.getAllclient(id);
    if (client)
        res.status(200).send({ "status": "OK", "message": "Cliente", "data": client });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer el cliente" });
};

const createclient = async (req, res) => {
    const { body } = req;
    const createdclient = await clients_service.createclient(body.DocumentClient, body.NameClient, body.EmailClient, body.TelephoneClient);
    if (createdclient)
        res.status(200).send({ "status": "OK", "message": "Cliente", "data": createdclient });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al crear el cliente" });
}

const updateclient = async (req, res) => {
    let id = req.params.id;
    let { DocumentClient, NameClient, EmailClient, TelephoneClient } = req.body;
    const updatedclient = await clients_service.updateclient( id, DocumentClient, NameClient, EmailClient, TelephoneClient );
    if (updatedclient)
        res.status(200).send({ "status": "OK", "message": "Cliente actualizado", "data": updatedclient });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar cliente" });
};

const deleteclient = async (req, res) => {
    let id = req.params.id;
    const deletedclient = await clients_service.deleteclient(id);

    if (deletedclient) 
        res.status(200).send({"status": "OK", "message": "Cliente Eliminado", "data": deletedclient});
    else 
    res.status(400).send({"status": "FAILED", "message": "Error al eliminar cliente"});
};

module.exports = { getAllclient, getOneclient, createclient, updateclient, deleteclient };