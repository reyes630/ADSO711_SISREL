const db = require('../models');

const getAllRoles = async () => {
    try {
        const allRoles = await db.role.findAll();
        return allRoles;
    } catch (error) {
        throw new Error(`Error al traer los roles: ${error.message}`);
    }
};

const getOneRole = async (id) => {
    try {
        const role = await db.role.findByPk(id);
        return role;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

const createRole = async (Role) => {
    try {
        let newRole = await db.role.create({
            Role,
        });
        return newRole;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

const updateRole = async (id, Role) => {
    try {
        await db.role.update({
            Role,
        }, {
            where: { id },
        });
        return await db.role.findByPk(id); // Obtener el rol actualizado
    } catch (error) {
        throw new Error(`Error al actualizar el rol: ${error.message}`);
    }
};

const deleteRole = async (id) => {
    try {
        console.log(id)
        const deletedRole = await db.role.destroy({
            where: {
                id,
            }
        });
        return deletedRole;
    } catch (error) {
        throw new Error(`Error al traer el rol: ${error.message}`);
    }
};

module.exports = { getAllRoles, getOneRole, createRole, updateRole, deleteRole };