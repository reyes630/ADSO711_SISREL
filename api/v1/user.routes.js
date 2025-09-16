const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const user_controller = require('../../controllers/userController');

router.get('/testUserApi', user_controller.testUserAPI);
router.get('/', user_controller.getAllUsers);
router.get('/:id', user_controller.getOneUser);
router.post('/', user_controller.createUser);
router.put('/:id', user_controller.updateUser);
router.delete('/:id', user_controller.deleteUser);

// Exportar el modulo
module.exports = router;