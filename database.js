let mysql = require("mysql2");
const host = "localhost";
const user="wongzhenkai";
const password = "1234QWer##";
const database = "fyp2";

var con = mysql.createConnection({host, user, password, database});
console.log(`Connecting to database at: ${host}`);
con.connect(function(err) {
    if (err) console.error(err);
    else console.log(`connected to mysql database: ${host}`);
});

module.exports = {con};