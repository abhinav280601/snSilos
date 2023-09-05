const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validate product input
    if (!name || !price || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    // Create a new product document
    const product = new Product({
      name,
      description,
      price,
    });

    // Save the product to the database
    await product.save();

    // Send the created product in the response
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve a list of products
exports.getProducts = async (req, res) => {
  try {
    // Retrieve all products from MongoDB
    const products = await Product.find();

    // Send the list of products in the response
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from URL parameter

    // Retrieve the product by ID from MongoDB
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send the product in the response
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from URL parameter
    const updatedProductData = req.body; // Updated product data

    // Validate and update the product in MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send a success response with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from URL parameter

    // Delete the product by ID from MongoDB
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
