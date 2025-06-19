import Product from "../models/productSchema.js";
import Category from "../models/categorySchema.js";
import fs from "fs";

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, sizes, colors } = req.body;
    console.log(req.body);
    console.log(req.file);
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
    const products = await Product.find().populate("category", "name");
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Cannot fetch the products. Refresh the page..." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    product.images.forEach((image) => fs.unlinkSync(image));
    res.status(200).json({ message: "Product deleted successfully.", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Cannot delete the product." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, sizes, price, colors, category, images } = req.body;
    const newData = {
      name: name,
      description: description,
      sizes: sizes,
      price: price,
      category: category,
      colors: colors,
      images: []
    };
    if(req.files){
      const files = req.files.map((img) => img.path )
      newData.images = [...newData.images, ...files]
    }
    if(images){
      newData.images = [...newData.images, ...images]
    }

    await Product.findByIdAndUpdate(id, newData)
    res.status(200).json({ message: "Product updated succesully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cannot update the product. Try again..." });
  }
};
