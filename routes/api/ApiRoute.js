const express = require("express");
const router = express.Router();
const ApiController = require("../../controllers/api/ApiController");

router.post("/routes/", ApiController.getRoutes);
router.post("/places/", ApiController.getPlaces);
router.get("/", ApiController.requestAnalyser_GET);
router.post("/", ApiController.requestAnalyser_POST);

module.exports = router;