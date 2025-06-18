const roles_service = require('../services/rolesService');
const getAllRoles = async (req, res) => {
    const roles = await roles_service.getAllRoles();
    if (roles)
        res.status(200).send({ "status": "OK", "message": "Rol", "data": roles });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los usuarios" });
};

const getOneRole = async (req, res) => {
    const id = req.params.id;
    const role = await roles_service.getOneRole(id);
    if (role)
        res.status(200).send({ "status": "OK", "message": "Rol", "data": role });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer usuario" });
};

const createRole = async (req, res) => {
    const { body } = req;
    const createdRole = await roles_service.createRole(body.Role);
    if (createdRole)
        res.status(200).send({ "status": "OK", "message": "Rol", "data": createdRole });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al tarer usuario" });
}

const updateRole = async (req, res) => {
    let id = req.params.id;
    let { Role } = req.body;
    const updatedRole = await roles_service.updateRole(id, Role);
    if (updatedRole)
        res.status(200).send({ "status": "OK", "message": "Usuario actualizado", "data": updatedRole });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar usuario" });
};

const deleteRole = async (req, res) => {
    let id = req.params.id;
    const deletedRole = await roles_service.deleteRole(id);

    if (deletedRole) 
        res.status(200).send({"status": "OK", "message": "Rol Eliminado", "data": deletedRole});
    else 
    res.status(400).send({"status": "FAILED", "message": "Error al eliminar rol"});
};

module.exports = { getAllRoles, getOneRole, createRole, updateRole, deleteRole };