const db = require("../config/database.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const moment = require("moment");
const jwt = require("jsonwebtoken");
const firma = require("../config/data.json").firma;

const postUser = async (req, res) => {
  let user = req.body;
  user.password = await bcrypt.hash(user.password, saltRounds);
  user.isAdmin = 0;

  db.query(
    "INSERT INTO usuarios (nombre_usuario, apellido_usuario, email, usuario, password, telefono, domicilio, isAdmin) VALUES (:nombre_usuario, :apellido_usuario, :email, :usuario, :password, :telefono, :domicilio, :isAdmin) ",
    { replacements: user}
  )
    .then((respuesta) => {
      res.status(201).send("Usuario registrado con éxito en la DB");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

const logIn = (req, res) => {
  // Usuario puede loguearse con usuario o email y password select where usuario || email && password
  let user = req.body;
  db.query(
    'SELECT * FROM usuarios WHERE usuario = ? OR email = ?',
    { replacements: [user.usuario, user.email],
      type: db.QueryTypes.SELECT }
  )
    .then(async (userLogin) => {
      console.log(userLogin);
      let isMatch = await bcrypt.compareSync(
        user.password,
        userLogin[0].password
      );
      if (isMatch) {
        let contenido = {
          id: userLogin[0].id,
          isAdmin: userLogin[0].isAdmin
        };
        let token = jwt.sign(contenido, firma, {expiresIn: '1 hour'});
        let respuesta = { token: token };
        res.status(200).json(respuesta);

      } else {
        res.status(401).send("Contraseña no válida");
      }
    })
    .catch((error) => {
      res.status(500).send("Email o usuario no registrado");
    });
};

const getAllUsers = (req, res) => {
  db.query("SELECT * FROM usuarios")
    .then((usuarios) => {
      res.status(200).json(usuarios[0]);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

module.exports = {
  postUser,
  logIn,
  getAllUsers,
};