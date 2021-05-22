const mongoose = require("mongoose");

const clienteSchema = mongoose.Schema({
  nome:{type:String, required: true},
  fone: {type:String, required: false, default: "0000000"},
  email: {type:String, required: true}
})

//exporta o modelo para torná-lo acessível aos outros módulos da aplicação

//Cliente é o nome associado a esse schema

module.exports = mongoose.model('Cliente', clienteSchema);

