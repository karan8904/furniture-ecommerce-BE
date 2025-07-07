import Product from "../models/productSchema.js";
import Wishlist from "../models/wishlistSchema.js";

export const addToWishlist = async (req, res) => {
  try {
    const userID = req.user._id;
    const productID = req.body.id;
    console.log(productID);
    await Wishlist.findOneAndUpdate(
      { userID },
      { $addToSet: { productIDs: productID } },
      { new: true, upsert: true }
    );
    const product = await Product.findById(productID);
    return res
      .status(200)
      .json({ message: "Product added to wishlist.", product });
  } catch (error) {
    res.status(500).json({ message: "Cannot add product to wishlist." });
  }
};

export const getFromWishlist = async (req, res) => {
  try {
    const userID = req.user._id;
    const wishlist = await Wishlist.findOne({ userID });
    if (!wishlist)
      return res
        .status(200)
        .json({ message: "No data available in wishlist.", products: [] });
    await wishlist.populate("productIDs");
    console.log(wishlist.productIDs);
    return res
      .status(200)
      .json({
        message: "Wishlist data retrieved successfully.",
        products: wishlist.productIDs,
      });
  } catch (error) {
    res.status(500).json({ message: "Cannot retrieve wishlist data." });
  }
};

export const removeFromWishlist = async(req, res) => {
  try {
    const userID = req.user._id
    const productID = req.params.id
    await Wishlist.findOneAndUpdate({ userID }, { $pull: { productIDs: productID }})
    return res.status(200).json({ message: "Wishlist updated successfully.", id: productID })
  } catch (error) {
    res.status(500).json({ message: "Cannot update the wishlist data." })
  }
}
