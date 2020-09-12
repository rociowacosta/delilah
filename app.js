const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const usuarios_routes = require ('./routes/usuarios_routes');
const pedidos_routes = require ('./routes/pedidos_routes');
const platos_routes = require ('./routes/platos_routes');

app.use(cors({ origin: "*" }), bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/usuarios', usuarios_routes);
app.use('/pedidos', pedidos_routes);
app.use('/platos', platos_routes);
module.exports = app;