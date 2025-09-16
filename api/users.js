const db = require('../models');
const {Router} = require('express');
// Creamos el router para poder usar los verbos HTTP
const router = Router();

// req => request => En request llegan los datos del body
// res => response => Se envian los datos hacia el cliente

router.get("/", (req, res)=> {
    res.send({Title: 'Hello ADSO'});
});

// Crear un usuario
router.post('/new', async (req, res) => {
    let documentUser = req.body.documentUser;
    let nameUser     = req.body.nameUser;
    let emailUser    = req.body.emailUser;
    let telephoneUser= req.body.telephoneUser;
    let passwordUser = req.body.passwordUser;
    try {
        await db.user.create({
            documentUser,
            nameUser,
            emailUser,
            telephoneUser,
            passwordUser,
        });
        res.status(200).send('Usuario creado');
    } catch (error) {
        res.status(400).send('Usuario no pudo ser creado');
    }
});

// Obtener todos los usuarios
router.get('/all', async (req, res) => {
    try {
        let users = await db.user.findAll();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send('No se pudieron obtener los usuarios');
    }
});

// Obtener usuario por id
router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let users = await db.user.findByPk(id);
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send('No se pudo obtener el usuario');
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let {documentUser, nameUser, emailUser, telephoneUser, passwordUser} = req.body;
        await db.user.update (
            {documentUser, nameUser,emailUser, telephoneUser, passwordUser },
            {
                where: {
                    id,
                }
            }
        );
        res.status(200).send("Usuario actualizado correctamente");
    } catch (error) {
        res.status(400).send("No se pudo actualizar el usuario");
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        await db.user.destroy ({
            where: {
                id,
            }
        }
    );
    res.status(200).send("Usuario eliminado correctamente");
    } catch (error) {
        res.status(400).send("No se pudo eliminar el usuario");
    }
});
module.exports = router;