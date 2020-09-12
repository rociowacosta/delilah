const express = require("express");
const usuarioController = require('../controllers/usuario_controller')
const middlewareUsuario = require('../middlewares/usuarios_middleware');
const api = express.Router();

api.get('/', middlewareUsuario.tokenIsAdmin, usuarioController.getAllUsers);
api.post('/', middlewareUsuario.userDataOk, usuarioController.postUser);
api.post('/login',middlewareUsuario.dataLogin, usuarioController.logIn)

module.exports = api;