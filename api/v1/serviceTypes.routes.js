const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const serviceTypes_controller = require('../../controllers/serviceTypesController');

router.get('/', serviceTypes_controller.getAllserviceTypes);
router.get('/:id', serviceTypes_controller.getOneServiceTypes);
router.post('/', serviceTypes_controller.createServiceTypes);
router.put('/:id', serviceTypes_controller.updateServiceTypes);
router.delete('/:id', serviceTypes_controller.deleteServiceTypes);

// Exportar el modulo
module.exports = router;