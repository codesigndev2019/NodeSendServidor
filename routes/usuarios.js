const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController')
const { check } = require('express-validator');
router.post('/',
    [check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check('pass', 'La contraseña debe ser de al menos 8 caracteres.').isLength({ min: 8 })],
    usuarioController.nuevoUsuario);

module.exports = router;