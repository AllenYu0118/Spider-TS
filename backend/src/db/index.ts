import mysql from "mysql"

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'spider_db'
})

connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
})

connection.query('SELECT 1', function (error, results, fields) {
  if (error) throw error;
  console.log('connected!')
});

export default connection

// connection.query('CREATE TABLE github (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), star VARCHAR(255), url VARCHAR(255))', (err, result) => {
//     if (err) throw err;
//     console.log('Table Create Success!')
// })