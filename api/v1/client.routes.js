const { Router } = require('express');
const router = Router(); // Creamos instancia del router

const client_controller = require('../../controllers/clientController');

router.get('/', client_controller.getAllclient);
router.get('/:id', client_controller.getOneclient);
router.post('/', client_controller.createclient);
router.put('/:id', client_controller.updateclient);
router.delete('/:id', client_controller.deleteclient);

// Exportar el modulo
module.exports = router;