const express = require('express');
const orderRouter = express.Router();
const orderService = require("../service/orderService")

orderRouter.get("/", orderService.allOrders);
orderRouter.get("/:id", orderService.getSingleOrder);
orderRouter.post("/:id/ship", orderService.shipOrder);
orderRouter.get("/:id/update-amount", orderService.updateAmount);
orderRouter.get("/:id/full", orderService.getFullOrder);

module.exports = orderRouter;