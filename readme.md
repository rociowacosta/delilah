# Delilah Resto API

Backend de una API de pedidos de comida: arquitectura, bases de datos relacionales y endpoints funcionales, permite el manejo y administración de pedidos, CRUD de productos y gestión de usuarios.

# Comencemos 🚀


## 1- Clonar Proyecto:
- Descargar codigo [acá](https://github.com/ArianaNieto/delilah).
- Desde la consola: 

`git clone https://github.com/ArianaNieto/delilah`

## 2- Instalar Dependencias:
~~~
npm install
~~~

## 3- Crear DB:
- Abrir el archivo `createDB.sql` que se encuentra en la carpeta `scripts`, copiar las queries y ejecutarlas en el motor de base de datos en MySQL.

- Abrir el archivo `db_connection_data` que se encuentra dentro de la carpeta `config` y completar con tus datos

   `conf_db_host = 'localhost', // host`
   
   `conf_db_name = 'delilah', // database name` 
    
   `conf_user = 'root', // user name`
    
   `conf_password = ' ', // password`
    
   `conf_port = '3306'; // port number`

## 4- Realizar un bulk-insert:
~~~
cd scripts/
node bulk.js
~~~

## 5- Ejecutar el server:
~~~
cd ..
nodemon server.js/
~~~

## 6- Testear endpoints en Postman:
- Seleccionar `delilahResto.postman_collection.json` desde Postman 
