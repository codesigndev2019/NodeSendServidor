const Enlaces = require('../models/enlaceModel')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, resp, next) => {
    // revisar si hay errores 
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return resp.status(400).json({ msj: errors.array() })
    }
    // creamos el objeto
    const { nombre_original, nombre } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    // si el usuario esta autenticado 
    if (req.usuario) {
        const { pass, descargas } = req.body;
        // asignar a enlace numero de descargas 
        if (descargas) {
            enlace.descargas = descargas;
        }
        // asignar un pass 
        if (pass) {
            const salt = await bcrypt.genSalt(10);
            enlace.pass = await bcrypt.hash(pass, salt)
        }
        // asignacion de autor 
        enlace.autor = req.usuario.id
    }

    // almacenar en bd
    try {
        await enlace.save();
        resp.json({ msg: `${enlace.url}` });
        return next();
    } catch (error) {
        console.log(error)
    }
}


exports.verificarPass = async (req, resp, next) => {
    const { url } = req.params;
    const { pass } = req.body;

    const enlace = await Enlaces.findOne({ url })
   
    if (bcrypt.compareSync(pass, enlace.pass)) {
        next();
    } else {
        return resp.status(401).json({ msg: 'Contraseña incorrecta' })
    }
}

// obtener el enlace 
exports.obtenerEnlace = async (req, resp, next) => {
    // verificar si existe el enlace 
    const { url } = req.params;
    const enlace = await Enlaces.findOne({ url })
    if (!enlace) {
        resp.status(404).json({ msg: 'No se encontro el enlace consultado' })
        return next()
    }
    // si enlace existe 

    resp.json({ archivo: enlace.nombre, pass: false })

    next();
}

//retorna si el enlace tiene pass o no 

exports.tienePass = async (req, resp, next) => {
    const { url } = req.params;
    const enlace = await Enlaces.findOne({ url })
    if (!enlace) {
        resp.status(404).json({ msg: 'No se encontro el enlace consultado' })
        return next()
    }

    if (enlace.pass) {
        return resp.json({ pass: true, archivo: enlace.url });
    }
    next();
}

exports.todosEnlaces = async (req, resp) => {
    try {
        const enlaces = await Enlaces.find({}).select('url');
        resp.json({ enlaces });
    } catch (error) {
        console.log(error)
    }
}

