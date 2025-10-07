const user_service = require('../services/userService');

const testUserAPI = (req, res) => {
    console.log('testUserAPI');
    res.status(200).send({
        "status": "OK",
        "message": "API User state: available"
    });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await user_service.getAllUsers();
        if (users)
            res.status(200).send({ "status": "OK", "message": "Usuarios", "data": users });
        else
            res.status(400).send({ "status": "FAILED", "message": "Error al traer los usuarios" });
    } catch (error) {
        res.status(500).send({ "status": "FAILED", "message": error.message });
    }
};

const getOneUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user_service.getOneUser(id);
        if (user)
            res.status(200).send({ "status": "OK", "message": "Usuario", "data": user });
        else
            res.status(400).send({ "status": "FAILED", "message": "Error al traer usuario" });
    } catch (error) {
        res.status(500).send({ "status": "FAILED", "message": error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { body } = req;
        const createdUser = await user_service.createUser(body.documentUser, body.nameUser, body.emailUser, body.telephoneUser, body.passwordUser, body.FKroles, body.coordinator);
        if (createdUser)
            res.status(200).send({ "status": "OK", "message": "usuario", "data": createdUser });
        else
            res.status(400).send({ "status": "FAILED", "message": "Error al crear usuario" });
    } catch (error) {
        res.status(500).send({ "status": "FAILED", "message": error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        let id = req.params.id;
        let { documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles } = req.body;
        const updatedUser = await user_service.updateUser(id, documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles, coordinator);
        if (updatedUser)
            res.status(200).send({ "status": "OK", "message": "Usuario actualizado", "data": updatedUser });
        else
            res.status(400).send({ "status": "FAILED", "message": "Error al actualizar usuario" });
    } catch (error) {
        res.status(500).send({ "status": "FAILED", "message": error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        let id = req.params.id;
        const deletedUser = await user_service.deleteUser(id);
        if (deletedUser) 
            res.status(200).send({"status": "OK", "message": "Usuario Eliminado", "data": deletedUser});
        else 
            res.status(400).send({"status": "FAILED", "message": "Error al eliminar usuario"});
    } catch (error) {
        res.status(500).send({ "status": "FAILED", "message": error.message });
    }
};

module.exports = { testUserAPI, getAllUsers, getOneUser, createUser, updateUser, deleteUser };