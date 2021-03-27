const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('DB conectada')
    } catch (error) {
        console.log('hubo un error');
        console.log(error);
        process.exit();
    }
}

module.exports = connectDB;
