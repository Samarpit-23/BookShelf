import express from "express";
import { addItemToCartController, getCartController, productCartController, removeCartController } from "../controllers/cartControllers.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get the current user's cart
router.get('/getCart/:email', requireSignIn, getCartController);

// Add item to the cart
router.post('/addto-cart', requireSignIn, addItemToCartController);

// Remove item from the cart
// router.delete('/cart/:productId', requireSignIn, removeItemFromCartController);

router.post("/removeFromCart", requireSignIn,removeCartController);

//get product
router.post('/product-cart/:id',productCartController)
export default router;
