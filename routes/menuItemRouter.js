const express = require('express');
const menuItemRouter = express.Router();
const menuItemService = require("../service/menuItemService")


menuItemRouter.get("/", menuItemService.getMenuItemsPage);
menuItemRouter.post("/", menuItemService.saveMenuItem)
menuItemRouter.get("/:id", menuItemService.findMenuItemWithId)
menuItemRouter.post("/:id/add-to-cart", menuItemService.addToCart);

module.exports = menuItemRouter;