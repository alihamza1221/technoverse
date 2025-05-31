const express = require("express");
const { getAIResponse } = require("../controller/ai.controller");
const router = express.Router();

router.post("/getResponse", getAIResponse);

module.exports = router;
