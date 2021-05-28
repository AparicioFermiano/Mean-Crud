const express = require("express");
const app = express();
const mongoose = require('mongoose');
const clienteRouters = require('./rotas/clientes');

app.use(express.json());

mongoose.connect('mongodb+srv://app_node:GnInumPjJx4OwwvZ@cluster0.9upxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true}).then(() => {
  console.log ("Conexão OK")
}).catch(() => {
  console.log("Conexão ERROR")
})

app.use ((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type,  Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE,OPTIONS, PUT');
  next();
});
//Incluindo as rotas com os parametros abaixo:
app.use(clienteRouters)
// app.use(clienteRouters)

module.exports = app;
