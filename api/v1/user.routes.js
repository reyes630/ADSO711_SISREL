const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const user_controller = require('../../controllers/userController');
const authService = require('../../services/authService');

// Ruta de prueba (pública)
router.get('/testUserApi', user_controller.testUserAPI);

// Rutas protegidas con autenticación
router.get('/', authService.authenticate, user_controller.getAllUsers);
router.get('/:id', authService.authenticate, user_controller.getOneUser);
router.post('/', authService.authenticate, user_controller.createUser);
router.put('/:id', authService.authenticate, user_controller.updateUser);
router.delete('/:id', authService.authenticate, user_controller.deleteUser);

// Exportar el modulo
module.exports = router;