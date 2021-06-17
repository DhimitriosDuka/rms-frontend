const express = require('express');
const menuItemRouter = express.Router();
const menuItemService = require("../service/menuItemService")


menuItemRouter.get("/", menuItemService.getMenuItemsPage);
menuItemRouter.post("/", menuItemService.saveMenuItem)
menuItemRouter.get("/:id", menuItemService.findMenuItemWithId)
menuItemRouter.post("/:id/add-to-cart", menuItemService.addToCart);
menuItemRouter.get("/:id/edit", menuItemService.getUpdatePage);
menuItemRouter.post("/:id/edit", menuItemService.updateMenuItem);
menuItemRouter.post("/:itemId/ingredient/:ingredientId", menuItemService.updateAmountOfIngredient);
menuItemRouter.get("/:itemId/ingredient/:ingredientId/delete", menuItemService.deleteIngredientOfItem);
menuItemRouter.get("/:itemId/delete", menuItemService.updateAvailability);


module.exports = menuItemRouter;