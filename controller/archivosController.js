const shortid = require('shortid')
const multer = require('multer');
const fs = require('fs');
const Enlaces = require('../models/enlaceModel');
exports.subirArchivo = async (req, resp, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1000000 },
        storage: filteStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}.${extension}`)
            },

        })
    }
    const upload = multer(configuracionMulter).single('archivo');

    upload(req, resp, async (error) => {
        console.log(req.file)

        if (!error) {
            resp.json({ archivo: req.file.filename })
        } else {
            console.log(error)
            return next()
        }
    });

}

exports.eliminarArchivo = async (req, resp) => {
    console.log(req.archivo , '2')
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log
    } catch (error) {
        console.log(error)
    }
}

// descargar el archivo 

exports.descargar = async (req, resp, next) => {
//obtenemos el enlace

const enlace = await Enlaces.findOne({nombre:  req.params.archivo});

    const archivo = __dirname  + '/../uploads/' + req.params.archivo
    resp.download(archivo);

    // eliminamos el archivo y de bd 
     // si descargas es igual a 1 se debe borrar el archivo 
     const { descargas, nombre } = enlace;

     if (descargas === 1) {
        // eliminar archivo 
        req.archivo = nombre;
        console.log(enlace.id)
        // eliminar entrada de la bd
        await Enlaces.findOneAndRemove(enlace.id)
    } else {
        // si descargas > 1 restamos 1 
        enlace.descargas--;
        await enlace.save();
    }
}