const express = require('express');
const http = require('http');
const app = express();
const userRoutes = require('./routes/user.routes');
//const db = require('./models/user');
const { Sequelize } = require('sequelize');

app.use(express.json());


//connection base de donnée

const sequelize = new Sequelize("database_development", "root", "Farnoux22061980", {
  dialect: "mysql",
  host: "localhost"
});

try {
  sequelize.authenticate();
  console.log('Connecté à la base de données MySQL!');
} catch (error) {
  console.error('Impossible de se connecter, erreur suivante :', error);
}

app.use('/api/user', userRoutes);


const server = http.createServer(app);

 
 //server
 
  server.listen(3000, () =>{
    console.log("server running");

  }
  );
