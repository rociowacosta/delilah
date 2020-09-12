const express = require("express");
const middlewareUsuario = require('../middlewares/usuarios_middleware');
const pedidoController = require ('../controllers/pedido_controller')
const middlewarePedido = require('../middlewares/pedidos_middleware')
const api = express.Router();

api.get('/', middlewareUsuario.tokenIsAdmin, pedidoController.getAllPedidos);
api.get('/:id', middlewareUsuario.tokenIsAdmin, pedidoController.getPedidoById);
api.post('/', middlewareUsuario.tokenOk, middlewarePedido.platosPedidos, pedidoController.postPedido);
api.patch('/', middlewareUsuario.tokenIsAdmin, pedidoController.upDateEstado);
api.delete('/', middlewareUsuario.tokenIsAdmin, pedidoController.deletePedidoUsuario);


module.exports = api;