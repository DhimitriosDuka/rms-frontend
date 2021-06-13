const express = require('express');
const loginRouter = express.Router();
const loginService = require("../service/loginService")


loginRouter.get("/", loginService.getServerPage);
loginRouter.post("/login", loginService.login)
loginRouter.get("/signup", loginService.signupPage)
loginRouter.post("/signup", loginService.signup)
loginRouter.get("/logout", loginService.logOut);

module.exports = loginRouter;