const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const services_controller = require('../../controllers/servicesController');

router.get('/', services_controller.getAllServices);
router.get('/:id', services_controller.getOneServices);
router.post('/', services_controller.createService);
router.put('/:id', services_controller.updateService);
router.delete('/:id', services_controller.deleteService);

// Exportar el modulo
module.exports = router;