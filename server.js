const http = require("http");
const app = require('./backend/app');


const port = process.env.PORT || 3500;
app.set('port', port);

const server = http.createServer(app);
// const express = require("express");
// const port = 3500
// const app = express
// app.use(express.json)

server.listen(port)
