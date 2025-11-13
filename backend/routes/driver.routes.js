const express = require("express");
const router = express.Router();
const taixeController = require("../controllers/driver.controller");
const { validateTaiXe, handleValidation, validateDriverIDParam } = require("../middleware/driver.validator");
const { verifyToken } = require("../middleware/authJwt");

// CREATE 
router.post("/", verifyToken, validateTaiXe, handleValidation, taixeController.createTaiXe);

// READ ALL 
router.get("/", verifyToken, taixeController.getAllTaiXe);

// READ ONE
router.get("/:id", verifyToken, validateDriverIDParam, handleValidation, taixeController.getTaiXeById);

// UPDATE
router.put("/:id", verifyToken, validateDriverIDParam, handleValidation, validateTaiXe, handleValidation, taixeController.updateTaiXe);

// DELETE
router.delete("/:id", verifyToken, validateDriverIDParam, handleValidation, taixeController.deleteTaiXe);

module.exports = router;
