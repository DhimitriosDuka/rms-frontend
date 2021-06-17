const express = require('express');
const userRouter = express.Router();
const userService = require("../service/userService")

userRouter.get("/", userService.getUsersPage);
userRouter.post("/:id/schedule", userService.addSchedule);


module.exports = userRouter;