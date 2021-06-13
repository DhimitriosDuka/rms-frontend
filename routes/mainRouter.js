const express = require('express');
const mainPageRouter = express.Router();
const mainPageService = require("../service/mainService")

mainPageRouter.get("/", mainPageService.getMainPage);
mainPageRouter.post("/", mainPageService.filterMenuItems);
mainPageRouter.get("/checkout", mainPageService.getCheckOutPage);


module.exports = mainPageRouter;