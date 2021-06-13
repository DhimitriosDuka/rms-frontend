const express = require('express');
const ingredientRouter = express.Router();
const ingredientService = require("../service/ingredinetService")

ingredientRouter.get("/", ingredientService.loadPage);
ingredientRouter.post("/", ingredientService.saveIngredient);
ingredientRouter.get("/edit/:id", ingredientService.getUpdateIngredientPage);
ingredientRouter.post("/edit/:id", ingredientService.updateIngredient);

module.exports = ingredientRouter;