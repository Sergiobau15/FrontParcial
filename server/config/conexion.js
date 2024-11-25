const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"Proyectoo"
});

db.connect(err => {

    if (err) {
        
        console.log(`Error al conectarse con la base de datos: ${err}`);
        
    } else{

        console.log("Base de datos conectada con exito");
        
    }
});

module.exports = db;