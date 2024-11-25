const express = require('express');
const router = express.Router();
const { createVenta, sales} =require('../controllers/sale')

router.post("/create", createVenta);
router.get("/all", sales)


module.exports = router;