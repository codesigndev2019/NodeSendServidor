const Usuario = require('../models/modeloUsuario');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })


exports.authUser = async (req, resp, next) => {
    try {
        // revisamos si hay errores 
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return resp.status(400).json({ msj: errors.array() })
        }
        // buscamos el usuario 
        const { email, pass } = req.body;
        let userExist = await Usuario.findOne({ email });
        if (!userExist) {
            resp.status(401).json({ msg: 'Usuario o contraseña incorrectos, prueba de nuevo' })
            return next();
        }
        // verificamos pass y autenticamos 
        if (bcrypt.compareSync(pass, userExist.pass)) {
            // crear JWT 
            const token = jwt.sign({
                id: userExist._id,
                nombre: userExist.nombre,
                email: userExist.email
            }, process.env.SECRET, {
                expiresIn: '8h'
            })
            resp.json({
                token
            })
        } else {
            resp.status(401).json({ msg: 'Usuario o contraseña incorrectos, prueba de nuevo' })
            return next();
        }


    } catch (error) {
        console.log(error)
    }


}
// como validar un usuario autenticado sin middleware
exports.authenticatedUser = async (req, resp, next) => {
   resp.json({usuario: req.usuario})
}