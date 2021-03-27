const Usuario = require('../models/modeloUsuario');
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator');
exports.nuevoUsuario = async (req, resp) => {

    try {
        // mostrar mensaje de error express validator
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return resp.status(400).json({ msj: errors.array() })
        }
        //verificar si el usuario ya fue registrado 
        const { email, pass } = req.body;
        let userExist = await Usuario.findOne({ email });
        if (userExist) {
            return resp.status(400).json({ msg: 'El usuario ya exite' })
        }
        const usuario = new Usuario(req.body);
        const salt = await bcrypt.genSalt(10);
        usuario.pass = await bcrypt.hash(pass, salt)
        usuario.save();
        resp.json({ msg: 'Usuario creado correctamente' })
    } catch (error) {
        console.log(error)
    }
}