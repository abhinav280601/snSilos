const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

// Add a product to the user's cart
exports.addToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId; // Extract productId from URL parameter
    const { id } = req.id;

    // Validate user input
    // if (!quantity || quantity <= 0) {
    //   return res.status(400).json({ error: "Invalid quantity" });
    // }

    // Find the user by their ID and ensure they exist
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the product with the given ID exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the user already has a cart entry
    let cart = await Cart.findOne({ user: id });

    if (!cart) {
      // If the user doesn't have a cart entry, create one
      cart = new Cart({
        user: id,
        products: [
          {
            product: productId,
            quantity: quantity,
          },
        ],
      });
    } else {
      // If the user already has a cart entry, update it
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // If the product already exists in the cart, update the quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({
          product: productId,
          quantity: quantity,
        });
      }
    }

    // Save the cart entry
    await cart.save();

    // Send a success response
    res.status(200).json({ message: "Product added to cart", cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a product from the user's cart
exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from URL parameter
    const { id } = req.id;

    // Find the user by their ID and ensure they exist
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's cart to remove the product
    await Cart.updateMany(
      { user: id },
      { $pull: { products: { product: productId } } }
    );

    // Send a success response
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve the user's cart with the list of products
exports.getCart = async (req, res) => {
  try {
    const { id } = req.id;
    // Find the user by their ID and ensure they exist
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const carts = await Cart.find({}).populate("user").exec();

    // Send the populated cart in the response
    res.status(200).json({ cart: carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
