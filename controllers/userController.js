const user_service = require('../services/userService');
const testUserAPI = (req, res) => {
    console.log('testUserAPI');
    res.status(200).send({
        "status": "OK",
        "message": "API User state: available"
    });
};

const getAllUsers = async (req, res) => {
    const users = await user_service.getAllUsers();
    if (users)
        res.status(200).send({ "status": "OK", "message": "Usuarios", "data": users });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer los usuarios" });
};

const getOneUser = async (req, res) => {
    const id = req.params.id;
    const user = await user_service.getOneUser(id);
    if (user)
        res.status(200).send({ "status": "OK", "message": "Usuario", "data": user });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al traer usuario" });
}

const createUser = async (req, res) => {
    const { body } = req;
    const createdUser = await user_service.createUser(body.documentUser, body.nameUser, body.emailUser, body.telephoneUser, body.passwordUser);
    if (createdUser)
        res.status(200).send({ "status": "OK", "message": "usuario", "data": createdUser });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al tarer usuario" });
}

const updateUser = async (req, res) => {
    let id = req.params.id;
    let { documentUser, nameUser, emailUser, telephoneUser, passwordUser } = req.body;
    const updatedUser = await user_service.updateUser(id, documentUser, nameUser, emailUser, telephoneUser, passwordUser);
    if (updatedUser)
        res.status(200).send({ "status": "OK", "message": "Usuario actualizado", "data": updatedUser });
    else
        res.status(400).send({ "status": "FAILED", "message": "Error al actualizar usuario" });
};

const deleteUser = async (req, res) => {
    let id = req.params.id;
    const deletedUser = await user_service.deleteUser(id);

    if (deletedUser) 
        res.status(200).send({"status": "OK", "message": "Usuario Eliminado", "data": deletedUser});
    else 
    res.status(400).send({"status": "FAILED", "message": "Error al eliminar usuario"});
};
module.exports = { testUserAPI, getAllUsers, getOneUser, createUser, updateUser, deleteUser };