const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
// creamos servidor

const app = express();

//conectar a BD 
connectDB();
//habilitar corrs
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));
// Puerto de la app 
const port = process.env.PORT || 4000;

//Habilitar leer los valores de un body 
app.use(express.json());

// habilitar carpeta publica 
app.use(express.static('uploads'));
//rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))
//arrancamos la app 
app.listen(port, '0.0.0.0', () => {
    console.log('El servidor esta funcionando')
})

