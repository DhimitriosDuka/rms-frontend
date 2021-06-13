const express = require('express');
const dashboardRouter = express.Router();
const dashboardService = require("../service/dashboardService")

dashboardRouter.get("/", dashboardService.loadDashboard);

module.exports = dashboardRouter;