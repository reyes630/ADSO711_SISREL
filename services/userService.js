const db = require('../models');
const bcrypt = require('bcrypt'); // Se incluye el bcrypt para la contraseña encriptada
const saltRounds = 10;

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

const createUser = async (documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles) => {
    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(passwordUser, saltRounds);
        
        let newUser = await db.user.create({
            documentUser,
            nameUser,
            emailUser,
            telephoneUser,
            passwordUser: hashedPassword, // Guardar la contraseña encriptada
            FKroles
        });
        return newUser;
    } catch (error) {
        throw new Error(`Error al crear el usuario ${error.message}`);
    }
};

const updateUser = async (id, documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles) => {
    try {
        const updateData = {
            documentUser,
            nameUser,
            emailUser,
            telephoneUser,
            FKroles
        };

        // Solo actualizar la contraseña si se proporciona una nueva
        if (passwordUser) {
            const hashedPassword = await bcrypt.hash(passwordUser, saltRounds);
            updateData.passwordUser = hashedPassword;
        }

        await db.user.update(updateData, {
            where: { id },
        });
        return await db.user.findByPk(id);
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
        throw new Error(`Error al eliminar el usuario ${error.message}`);
    }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Agregar verifyPassword al exports
module.exports = { getAllUsers, getOneUser, createUser, updateUser, deleteUser, verifyPassword };