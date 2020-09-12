const db = require('../config/database');
const fs = require('fs');
const bcrypt = require("bcrypt");
const saltRounds = 10;

function cargarPlatosDesdeCSV(file) {
    fs.readFile(file, 'utf8', async function (err, data) {
        const dataArray = data.split(/\r?\n/);
        dataArray.forEach(element => {
            let plato = element.split("|");
            console.log(plato);
            db.query(`INSERT INTO platos (nombre, precio, url_imagen, disponible)
            VALUES ('${plato[0]}', '${plato[1]}', '${plato[2]}', ${plato[3]} )`,
            ).then((respuesta) => {
                console.log(respuesta);
            }).catch((err) => {
                console.log(err);
            })
        });
    })
}

function cargarUsuariosDesdeCSV(file) {
    fs.readFile(file, 'utf8', async function (err, data) {
        const dataArray = data.split(/\r?\n/);
        console.log(dataArray)
        dataArray.forEach(async function (element){
            let usuario = element.split("|");
            usuario[4] = await bcrypt.hash(usuario[4], saltRounds);
            console.log(usuario[4]);
            db.query(`INSERT INTO usuarios (nombre_usuario, apellido_usuario, email, usuario, password, telefono, domicilio, isAdmin)
            VALUES ('${usuario[0]}','${usuario[1]}','${usuario[2]}','${usuario[3]}','${usuario[4]}','${usuario[5]}','${usuario[6]}',${usuario[7]})`,
            ).then((respuesta) => {
                console.log(respuesta);
            }).catch((err) => {
                console.log(err);
            })
        });
    })
}

cargarPlatosDesdeCSV('platos.csv');
cargarUsuariosDesdeCSV('usuarios.csv');
