const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')
const { check } = require('express-validator');
const auth = require('../middleware/auth')

router.post('/', [check("email", "Debe ingresar un correo valido").isEmail(),
check("pass", "La contraseña debe ser de al menos 8 caracteres").isLength({ min: 8 })],
    authController.authUser)

router.get('/', auth, authController.authenticatedUser)

module.exports = router;