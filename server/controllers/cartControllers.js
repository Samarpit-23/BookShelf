import cartModel from "../models/cartModel.js";
import Cart from "../models/cartModel.js";
import ProductModel from "../models/ProductModel.js";
import { mongo } from "mongoose";
// Get the current user's cart
export const getCartController = async (req, res,next) => {
  try {
    const userEmail=req.params.email;
    // const userEmail=email
    
    // console.log(user,userEmail)
    const cart = await Cart.find({userEmail});
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log("cart found")
    // console.log("cart",cart)
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to the cart
export const addItemToCartController = async (req, res, next) => {
  try {
    const {user,product}=req.body;
    // console.log(user)
    // console.log(product);
    
    if (!product || !user) {
      return res.status(400).json({ message: "Product and user details are required" });
    }
    const productId = product._id;
    const quantity = 1;
    const userEmail = user.email;
    // console.log(productId,userEmail)
  
    let cart = await Cart.findOne({ userEmail });
    // console.log(cart);
    
    if (!cart) {
      const newCart = new Cart({
        products: [{ id: productId, quantity }],
        userEmail
      });
      const createdCart = await newCart.save();
      console.log("cart created")
      return res.json({ success: true, createdCart });
    }
 // Cart exists, check if product already exists
//  console.log(cart);
 
 const productIndex = cart.products.findIndex((p) => p.id === productId);
  console.log(productIndex);
  
 if (productIndex > -1) {
   // Product exists, update quantity
   cart.products[productIndex].quantity += quantity;
 } else {
   // Product does not exist, add new product
   cart.products.push({ id: productId, quantity });
 }

 const savedCart = await cart.save();
 console.log("Item added to existing cart")
 res.json(savedCart);
  } catch (error) {
    console.error("Something wrong while adding to cart, error");
    res.status(500).json({ message: error.message });
  }
};

// Remove item from the cart
// export const removeItemFromCartController = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const cart = await Cart.findOne({ userId: req.user.id });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const removeCartController = async (req, res) => {
  try {
    const { productId, userEmail } = req.body;

    // Find the user's cart by email
    const cart = await Cart.findOne({ userEmail });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Remove the product from the cart
    const productIndex = cart.products.findIndex((product) => product._id.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// get cart product controller
export const productCartController = async (req, res) => {
  try {
    const id=req.params.id
    const product = await ProductModel.findOne({_id:id})
      .select("-photo");
    res.status(200).send({
      success: true,
      counTotal: product.length,
      message: "single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting  Products",
      error
    });
  }
};
