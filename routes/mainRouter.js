const express = require('express');
const mainPageRouter = express.Router();
const mainPageService = require("../service/mainService")

mainPageRouter.get("/", mainPageService.getMainPage);
mainPageRouter.post("/", mainPageService.filterMenuItems);
mainPageRouter.get("/checkout", mainPageService.getCheckOutPage);
mainPageRouter.post("/checkout", mainPageService.checkout);
mainPageRouter.get("/my-orders", mainPageService.getMyOrders);


module.exports = mainPageRouter;