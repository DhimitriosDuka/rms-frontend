const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");


const app = express();
const port = 3000;

const loginRouter = require("./routes/loginRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const ingredientRouter = require("./routes/ingredientRouter");
const menuItemRouter = require("./routes/menuItemRouter");
const orderRouter = require("./routes/orderRouter");
const mainPageRouter = require("./routes/mainRouter");

app.set("view engine", "ejs");
app.set("views", __dirname + "/view");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(flash());
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));


app.use(
    session({
        secret: "$2b$10$v.pAaS4e0c9Vq0I2RqiHHup6XFB4Z31D4RE/vRLFhj5EuEgGDzsYO",
        resave: false,
        saveUninitialized: true,
        maxAge: Date.now() + 30 * 86400 * 1000,
    })
);

app.use("/", loginRouter);
app.use("/dashboard", dashboardRouter);
app.use("/ingredient", ingredientRouter);
app.use("/menu-item", menuItemRouter);
app.use("/order", orderRouter);
app.use("/main", mainPageRouter);

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

