const mysql = require("mysql2/promise");

const connectionPromise = mysql.createConnection({
    host: "localhost",
    // Your mysql username
    user: "root",
    //Your mysql password
    password: "test",
    database: "employees",
},
    console.log('You are connected to the employees database.')
);


module.exports = connectionPromise;