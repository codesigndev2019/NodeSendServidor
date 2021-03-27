const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

module.exports = (req, resp, next) => {
    const authHeader = req.get('Authorization')

    if (authHeader) {
        // obtenermos el token 
        const token = authHeader.split(' ')[1];
        //comprobamos el jwt
        try {
            const usuario = jwt.verify(token, process.env.SECRET);
            req.usuario = usuario;
        } catch (error) {
            console.log(error)
            
        }

    }
    return next()
}