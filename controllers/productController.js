import Product from "../models/productSchema.js";
import Category from "../models/categorySchema.js";
import { uploadToCloudinary } from '../middlewares/upload.js';

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      sizes,
      colors,
      discount_percent,
      stock,
      isVisible,
    } = req.body;
    const isProductExists = await Product.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      category: category,
    });
    if (isProductExists) {
      return res.status(400).json({ message: "This product already exists." });
    }
    const imagesURL = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer, 'furniture-ecomm/products').then(r => r.secure_url))
    );
    const product = new Product({
      name,
      description,
      category,
      price,
      sizes,
      colors,
      images: imagesURL,
      discount_percent,
      stock,
      isVisible,
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
    res.status(200).json({ message: "Product deleted successfully.", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Cannot delete the product." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      description,
      sizes,
      price,
      colors,
      category,
      images,
      discount_percent,
      stock,
      isVisible,
    } = req.body;
    const newData = {
      name,
      description,
      sizes,
      price,
      category,
      colors,
      images: [],
      discount_percent,
      stock,
      isVisible,
    };
    if (req.files) {
      const files = await Promise.all(req.files.map(async(img) => {
        const result = await uploadToCloudinary(img.buffer, 'furniture-ecomm/products');
        return result.secure_url ?? null
      }));
      newData.images = [...newData.images, ...files];
    }
    if (images) {
      newData.images = [...newData.images, ...images];
    }

    await Product.findByIdAndUpdate(id, newData);
    res.status(200).json({ message: "Product updated succesully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cannot update the product. Try again..." });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("category", "name");
    if (!product)
      return res.status(404).json({ message: "Product does not exist." });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Cannot get the product. Try again.." });
  }
};

export const getProductsFromCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.find({ category: id }).populate(
      "category",
      "name"
    );
    if (!products)
      return res
        .status(400)
        .json({ message: "Cannot get products from this category." });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Cannot get products. Try again." });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.params.query;
    const products = await Product.find({
      name: { $regex: `^${query}`, $options: "i" },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Product not found." });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const query = req.params.query;
    const sort = {};
    if (query === "price-high2low") sort.finalPrice = -1;
    if (query === "price-low2high") sort.finalPrice = 1;
    if (query === "date-recent") sort.createdAt = -1;

    if (query === "default"){
      const products = await Product.find()
      return res.status(200).json(products)
    };
    
    const products = await Product.aggregate([
      {
        $addFields: {
          finalPrice: {
            $cond: [
              { $ifNull: ["$discount_percent", false] },
              { $subtract: ["$price", {$multiply: ["$price", { $divide: [ "$discount_percent", 100 ] }] }] },
              "$price"
            ]
          }
        }
      },
      { 
        $sort: sort 
      }
    ]);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "No products found." });
  }
};
