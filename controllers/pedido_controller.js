const db = require("../config/database");
const moment = require("moment");

const getAllPedidos = (req, res) => {
    db.query(`SELECT e.estado, p.hora, p.id AS idPedido, dp.cantidad, pl.nombre, f.forma_pago,
    p.precio_total, u.nombre_usuario, u.apellido_usuario, u.domicilio
    FROM pedidos p
    JOIN estados e ON p.id_estado = e.id
    JOIN detalle_pedido dp ON dp.id_pedidos = p.id
    JOIN platos pl ON dp.id_plato = pl.id
    JOIN formas_de_pago f ON p.id_forma_pago = f.id
    JOIN usuarios u ON p.id_usuarios = u.id
    ORDER BY e.id ASC`).then((respuesta) => {
        let pedidos = respuesta[0];
        let listaPedidosById = pedidos.reduce(function (acc, element) {
        acc[element.idPedido] = acc[element.idPedido] || [];
        acc[element.idPedido].push(element);
        return acc;
    }, {});
        res.json(listaPedidosById)
    }).catch((error) => {
        res.status(500).send(error)
    });
};

const getPedidoById = (req, res) => {
  let idPedido = req.params.id ;
  console.log(idPedido)
  db.query(`SELECT pl.nombre AS plato, pl.precio, pl.url_imagen, u.nombre_usuario, u.email, u.domicilio, u.telefono, dp.cantidad AS cantidad, p.precio_total, p.id AS idPedido, fp.forma_pago, e.estado
  FROM detalle_pedido dp
  JOIN platos pl ON dp.id_plato = pl.id
  JOIN pedidos p ON dp.id_pedidos = p.id
  JOIN usuarios u ON p.id_usuarios = u.id
  JOIN formas_de_pago fp ON p.id_forma_pago = fp.id
  JOIN estados e ON p.id_estado = e.id
  GROUP BY dp.id HAVING p.id = ?`, {replacements: [idPedido]})
  .then((respuesta) => {
    res.json(respuesta[0])
  }).catch ((error) => {
    res.json(error)
  })
};

const postPedido = async (req, res) => {
  let usuario = req.usuario;
  let hora = moment().format("YYYY-MM-DD HH:mm:ss");
  let newPedido = req.body;
  let detalle = newPedido.detalle;

  db.query(
    "INSERT INTO pedidos (id_usuarios, id_forma_pago, hora) VALUES (?, ?, ?)",
    {
      replacements: [usuario.id, newPedido.id_forma_pago, hora],
    }
  )
    .then(async (respuesta) => {
      let idPedido = respuesta[0];
      insertDetalle(detalle, idPedido)
        .then((respuesta) => {
          return upDateTotal(respuesta, idPedido);
        })
        .catch((error) => {
          console.log(error + " error de promesas");
        });

      res.status(201).json({idPedido: idPedido});
    })
    .catch((error) => {
      res.status(500).send( error);
    });
};

function getPrecioPlato(idPlato) {
  return new Promise(function (resolve, reject) {
    db.query("SELECT precio FROM platos WHERE id = ?", {
      replacements: [idPlato],
      type: db.QueryTypes.SELECT,
    })
      .then((respuesta) => {
        if (respuesta.length !== 0) {
          resolve(respuesta[0]);
        }
      })
      .catch((error) => {
        reject("plato no existe" + error);
      });
  });
};

function insertDetalle(detalle, idPedido) {
  return new Promise(function (resolve, reject) {
    let total = 0;
    detalle.forEach(async function (element) {
      let precio = await getPrecioPlato(element.idPlato);
      let precio_subtotal = precio.precio * element.cantidad;
      total = total + precio_subtotal;

      db.query(
        "INSERT INTO detalle_pedido (id_pedidos, id_plato, cantidad, precio_subtotal) VALUES (?, ?, ?, ?)",
        {
          replacements: [
            idPedido,
            element.idPlato,
            element.cantidad,
            precio.precio * element.cantidad,
          ],
        }
      )
        .then((respuesta) => {
          console.log(total);
          resolve(total);
        })
        .catch((error) => {
          console.log("catch del foreach" + error);
          reject(error + "catch del foreach");
        });
    });
  });
}

function upDateTotal(total, idPedido) {
  db.query("UPDATE pedidos SET precio_total = ? WHERE id = ? ", {
    replacements: [total, idPedido],
  })
    .then((respuesta) => {
      //console.log(respuesta[0])
    })
    .catch((error) => {
      console.log(error + "catch del update");
    })
    .catch((error) => {
      reject(error + " calcular total");
    });
};

const upDateEstado = (req, res) => {
  let hora = moment().format("YYYY-MM-DD HH:mm:ss");
  let estadoNuevo = req.body.idEstado;
  let pedido = req.body.idPedido;
  let usuario = req.usuario;

  db.query('SELECT id_estado FROM pedidos WHERE id = ?',
    {replacements: [pedido], type: db.QueryTypes.SELECT})
    .then((respuesta) => {
        if((respuesta[0].id_estado === estadoNuevo)){
            res.status(401).send('Estado no se puede cambiar porque es el mismo')
        } else {
            db.query("UPDATE pedidos SET id_estado = ?, hora = ? WHERE id = ?", {
                replacements: [estadoNuevo, hora, pedido],
              })
                .then((respuesta) => {
                  res.json({
                    estadoActual: estadoNuevo,
                    respuesta: respuesta[0],
                    dateTime: hora,
                    usuario: usuario.id,
                  });
                })
                .catch((error) => {
                  res.json({ error: error });
                });
        }
    }).catch((error) => {
        res.status(500).send(error)
    });
};

const deletePedidoUsuario = (req, res) => {
  // Cambiar estado pedido si idEstado < 3
  let idPedido = req.body.idPedido;

    db.query('DELETE FROM pedidos WHERE id = ?',
    {
      replacements: [idPedido]
    }).then((respuesta) => {
      res.status(200).send('Pedido ' + idPedido + ' eliminado')
    }).catch((error) => {
      res.status(500).send(error)
    })

}
module.exports = {
  getAllPedidos,
  postPedido,
  upDateEstado,
  getPedidoById,
  deletePedidoUsuario,

};