const db = require('../models');

const getAllUsers = async () => {
    try {
        const allUsers = await db.user.findAll();
        return allUsers;
    } catch (error) {
        throw new Error(`Error al traer los usuarios ${error.message}`);
    }
};

const getOneUser = async (id) => {
    try {
        const user = await db.user.findByPk(id);
        return user;
    } catch (error) {
        throw new Error(`Error al traer el usuario ${error.message}`);
    }
};

const createUser = async (documentUser, nameUser, emailUser, telephoneUser, passwordUser) => {
    try {
        let newUser = await db.user.create({
            documentUser,
            nameUser,
            emailUser,
            telephoneUser,
            passwordUser,
        });
        return newUser;
    } catch (error) {
        throw new Error(`Error al traer el usuario ${error.message}`);
    }
};

const updateUser = async (id, documentUser, nameUser, emailUser, telephoneUser, passwordUser) => {
    try {
        await db.user.update({
            documentUser,
            nameUser,
            emailUser,
            telephoneUser,
            passwordUser,
        }, {
            where: { id },
        });
        return await db.user.findByPk(id); // Obtener el usuario actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
};

const deleteUser = async (id) => {
    try {
        console.log(id)
        const deletedUser = await db.user.destroy({
            where: {
                id,
            }
        });
        return deletedUser;
    } catch (error) {
        throw new Error(`Error al traer el usuario ${error.message}`);
    }
};



module.exports = { getAllUsers, getAllUsers, getOneUser, createUser, updateUser, deleteUser };