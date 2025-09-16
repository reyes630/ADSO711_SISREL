const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const eventTypes_controller = require('../../controllers/eventTypesController');

router.get('/', eventTypes_controller.getAlleventTypes);
router.get('/:id', eventTypes_controller.getOneEventTypes);
router.post('/', eventTypes_controller.createEventTypes);
router.put('/:id', eventTypes_controller.updateEventTypes);
router.delete('/:id', eventTypes_controller.deleteEventTypes);

// Exportar el modulo
module.exports = router;