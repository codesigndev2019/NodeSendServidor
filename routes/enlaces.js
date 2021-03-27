const express = require('express');
const router = express.Router();
const enlacesController = require('../controller/enlacesController')
const archivosController = require('../controller/archivosController')
const { check } = require('express-validator');
const auth = require('../middleware/auth')


router.post('/', [
    check("nombre",
        "Sube un archivo").not().isEmpty(),
    check("nombre_original",
        "Sube un archivo").not().isEmpty()
],
    auth,
    enlacesController.nuevoEnlace)

router.get('/:url',
    enlacesController.tienePass,
    enlacesController.obtenerEnlace,
)

router.get('/',
    enlacesController.todosEnlaces)

router.post('/:url',
    enlacesController.verificarPass,
    enlacesController.obtenerEnlace)


module.exports = router;