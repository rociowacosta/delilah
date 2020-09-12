const db = require('../config/database.js');

const datosPlato = async (req, res, next) => {
    let plato = req.body;

    db.query('SELECT nombre FROM platos WHERE nombre = ?',
    {replacements: [plato.nombre], type: db.QueryTypes.SELECT})
    .then((respuesta)=> {
      console.log(respuesta)
      if(respuesta[0].nombre === plato.nombre) {
        res.status(406).send("Plato con ese nombre ya existe en la DB");
      }else {
        next();
      }
    }).catch((error) => {
      res.status(500).send(error)
    })
};

const platoFromDB = (req,res,next) =>{
    let plato = req.body;
    db.query('SELECT * FROM platos WHERE id = :id',
    {replacements:plato, type: db.QueryTypes.SELECT})
    .then((respuesta)=>{
      if(respuesta[0].id > 0){
        next();
      };
    }).catch((error)=>{
      res.status(404).send(error)
    });
  };

module.exports = {
    platoFromDB,
    datosPlato
}