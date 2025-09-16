const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const request_controller = require('../../controllers/requestController');

router.get('/', request_controller.getAllrequest);
router.get('/:id', request_controller.getOnerequest);
router.post('/', request_controller.createrequest);
router.put('/:id', request_controller.updaterequest);
router.delete('/:id', request_controller.deleterequest);

// Exportar el modulo
module.exports = router;