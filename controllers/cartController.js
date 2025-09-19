import Cart from "../models/cartSchema.js";

export const addToCart = async (req, res) => {
  try {
    const {
      userID,
      productID,
      selectedSize,
      selectedColor,
      finalPrice,
      quantity,
    } = req.body;
    if(!req.user._id.equals(userID))
      return res.status(401).json({ message: "Not Authorized." })
    const product = new Cart({
      userID,
      productID,
      selectedSize,
      selectedColor,
      price: finalPrice,
      quantity,
    });
    await product.save();
    res
      .status(201)
      .json({ message: "Product added into the cart successfully.", product });
  } catch (error) {
    res.status(500).json({ message: "Cannot add to the cart." });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const userID = req.user._id;
    if(!req.user._id.equals(userID))
      return res.status(401).json({ message: "Not Authorized." })
    const products = await Cart.find({ userID }).populate(
      "productID",
      "name images"
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Cannot get cart products." });
  }
};

export const increaseQuantity = async (req, res) => {
  try {
    const { userID, productID } = req.body;
    if(!req.user._id.equals(userID))
      return res.status(401).json({ message: "Not Authorized." })
    const product = await Cart.findOne({ userID, productID });
    product.quantity += 1;
    await product.save();
    res.status(200).json({ message: "Quantity updated successfully.", productID: productID });
  } catch (error) {
    res.status(500).json({ message: "Cannot increase quantity." });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const { userID, productID } = req.body;
    if(!req.user._id.equals(userID))
      return res.status(401).json({ message: "Not Authorized." })
    const product = await Cart.findOne({ userID, productID });
    product.quantity -= 1;
    await product.save();
    res.status(200).json({ message: "Quantity updated successfully.", productID: productID });
  } catch (error) {
    res.status(500).json({ message: "Cannot increase quantity." });
  }
};

export const removeFromCart = async (req, res) => {
    try {
        const id = req.params.id
        await Cart.findByIdAndDelete(id)
        res.status(200).json({ message: "Product removed from cart successfully." })
    } catch (error) {
        res.status(500).json({ message: "Cannot remove the product. Try again." })
    }
}
