const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const rol_controller = require('../../controllers/rolesController');

router.get('/', rol_controller.getAllRoles);
router.get('/:id', rol_controller.getOneRole);
router.post('/', rol_controller.createRole);
router.put('/:id', rol_controller.updateRole);
router.delete('/:id', rol_controller.deleteRole);

// Exportar el modulo
module.exports = router;