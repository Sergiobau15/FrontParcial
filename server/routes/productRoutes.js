const express = require('express');
const router = express.Router();
const { createProduct, 
        specificProduct, 
        products, 
        updateProduct, 
        inactivateProduct, 
        productsInactive, 
        activateProduct, 
        getCategories, 
        createCategory,
        updateCategory,
        deleteCategory,
        updateProductQuantity
    } = require('../controllers/product');

router.get("/categories", getCategories);
router.post("/create", createProduct);
router.get("/",products);
router.get("/productsInactive", productsInactive);
router.get("/:id", specificProduct);
router.put("/updateProduct/:id", updateProduct);
router.patch("/inactivateProduct/:id", inactivateProduct);
router.put("/activate/:id", activateProduct);
router.post("/createCategory", createCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);
router.put("/updateQuantity/:id", updateProductQuantity)

module.exports = router;