const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'diciembre32004',
  database: 'soderia'
});

connection.connect((err) => {
  if (err) {
    console.error('error al conectar', err);
    return;
  }
  console.log("Conectado a la bd");
});

module.exports = connection;
