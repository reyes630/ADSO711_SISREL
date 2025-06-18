const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const states_controller = require('../../controllers/statesController');

router.get('/', states_controller.getAllStates);
router.get('/:id', states_controller.getOneStates);
router.post('/', states_controller.createState);
router.put('/:id', states_controller.updateState);
router.delete('/:id', states_controller.deleteStates);

// Exportar el modulo
module.exports = router;