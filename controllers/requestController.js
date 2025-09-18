const request_service = require('../services/requestService');

const getAllrequest = async (req, res) => {
    const request = await request_service.getAllrequest();
    if (request)
        res.status(200).send({ "status": "OK", "message": "Solicitudes", "data": request });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer las solicitudes" });
};

const getOnerequest = async (req, res) => {
    const id = req.params.id;
    const request = await request_service.getOnerequest(id);
    if (request)
        res.status(200).send({ "status": "OK", "message": "Solicitud", "data": request });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer la solicitud" });
};

const createrequest = async (req, res) => {
    const { body } = req;
    const createdrequest = await request_service.createrequest(
        body.eventDate,
        body.location,
        body.municipality,
        body.observations,
        body.comments,
        body.requestMethod,
        body.needDescription,
        body.assignment,
        body.FKstates,
        body.FKeventtypes,
        body.FKclients,
        body.FKusers,
        body.FKservicetypes,
        body.archive_status
    );
    if (createdrequest)
        res.status(200).send({ "status": "OK", "message": "Solicitud creada", "data": createdrequest });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al crear la solicitud" });
};

const updaterequest = async (req, res) => {
    let id = req.params.id;
    let { eventDate, location, municipality, observations, comments, requestMethod, needDescription, assignment, FKstates, FKeventtypes, FKclients, FKusers, FKservicetypes, archive_status } = req.body;
    const updatedrequest = await request_service.updaterequest(
        id,
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
    );
    if (updatedrequest)
        res.status(200).send({ "status": "OK", "message": "Solicitud actualizada", "data": updatedrequest });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar solicitud" });
};

const deleterequest = async (req, res) => {
    let id = req.params.id;
    const deletedrequest = await request_service.deleterequest(id);

    if (deletedrequest) 
        res.status(200).send({"status": "OK", "message": "Solicitud eliminada", "data": deletedrequest});
    else 
        res.status(400).send({"status": "FAILED", "message": "Error al eliminar solicitud"});
};

module.exports = { getAllrequest, getOnerequest, createrequest, updaterequest, deleterequest };
