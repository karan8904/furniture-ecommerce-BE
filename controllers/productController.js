import Product from "../models/productSchema.js";
import Category from "../models/categorySchema.js";
import fs from "fs";

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, sizes, colors } = req.body;
    console.log(req.body)
    console.log(req.file)
    const isProductExists = await Product.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      category: category,
    });
    if (isProductExists) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
      return res.status(400).json({ message: "This product already exists." });
    }
    const imagesURL = req.files.map((image) => image.path);
    const product = new Product({
      name,
      description,
      category,
      price,
      sizes,
      colors,
      images: imagesURL,
    });
    await product.save();
    res.status(201).json({ message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Cannot add a product. Try again." });
  }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name')
        res.status(200).json({ products }) 
    } catch (error) {
        res.status(400).json({ message: "Cannot fetch the products. Refresh the page..." })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findByIdAndDelete(id)
        product.images.forEach((image) => fs.unlinkSync(image))
        res.status(200).json({ message: "Product deleted successfully.", product})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Cannot delete the product."})
    }
}
