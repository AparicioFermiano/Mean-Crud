const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Cliente = require("./models/cliente")

mongoose.connect('mongodb+srv://app_node:GnInumPjJx4OwwvZ@cluster0.9upxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true}).then(() => {
  console.log ("Conexão OK")
}).catch(() => {
  console.log("Conexão ERROR")
})

app.use(express.json());

const clientes = [
  {
    id: '1',
    nome: 'José',
    fone: '112431241',
    email: 'jose@gmail.com'
  },
  {
    id: '2',
    nome: 'Maria',
    fone: '112431241',
    email: 'maria@gmail.com'
  }
]

app.use ((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type,  Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE,OPTIONS, PUT');
  next();
});

app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then(documents =>{
  res.status(200).json({
    mensagem: "Tudo Ok",
    clientes: documents
  })
}).catch(() => {
  console.log("Erro de requisição")
});
})


app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  })
  cliente.save().then(
    (clienteInserido) => {
      res.status(201).json({mensagem: 'Cliente inserido com sucesso', id: clienteInserido._id})
    }
  )
  // const cliente = req.body;
  // console.log(cliente);
  // clientes.push(cliente);
  // res.status(201).json({mensagem: 'Cliente inserido!'});
})

app.delete('/api/clientes/:id', (req, res, next) =>{
  Cliente.deleteOne({_id: req.params.id})
    .then((resultado) => {
      console.log(resultado);
      res.status(200).json({mensagem: 'Cliente Removido!'})
    })
})

app.put('/api/clientes/:id', (req, res, next) => {
  const cliente = new Cliente ({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });
  Cliente.updateOne({_id: req.params.id}, cliente).then((resultado) => {
    console.log(resultado);
    res.status(200).json({mensagem:'Atualização realizada com sucesso!'})
  })
})



module.exports = app
