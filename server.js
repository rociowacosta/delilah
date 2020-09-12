const server = require('./app');
const db = require('./config/database');
//const fs = require('fs');
//const usuarioController = require('./controllers/usuario_controller')
const port = 3000;
server.listen(port, () => {
db.authenticate()
.then(() => {
  console.log('Conectado')
})
.catch(err => {
  console.log('No se conectó')
})

console.log('Server running on port: ' + port);
});


