const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {SERVER_PORT, DEV_ENV} = require("./ServerConf");

if (DEV_ENV) console.log("You're now in development mode!");
else console.log("You're now in production mode!");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("./statics"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("Index", {msg: "hello"});
});

app.use("/api", require("./routes/api/ApiRoute"));


app.listen(SERVER_PORT, () => console.log(`Server has been started and listening the port ${SERVER_PORT}`));