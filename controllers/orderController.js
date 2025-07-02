import { v4 } from "uuid";
import Cart from "../models/cartSchema.js";
import Order from "../models/orderSchema.js";
import sendMail from "../utils/sendMail.js";
import User from "../models/userSchema.js";

export const createOrder = async (req, res) => {
  try {
    const { userID, products, totalAmount, address, paymentMode } = req.body;
    if (!req.user._id.equals(userID))
      return res.status(401).json({ message: "Not Authorized." });
    const paymentStatus = "Pending";
    const orderStatus = "Placed";
    const orderID = v4();
    const order = new Order({
      userID,
      products,
      totalAmount,
      address,
      paymentMode,
      paymentStatus,
      orderStatus,
      orderID,
    });
    await order.save();
    await Cart.deleteMany({ userID: userID });
    const link = `${process.env.BASE_URL}/orders`
    const body = `<p>Dear User, </p>
                  <p>Your order with OrderID: ${orderID}, has been placed successully.</p>
                  <p><a href=${link}>Click Here<a> to check out the details.</p>
                  <p>Have a good day.</p>
                  <p>Thank you.</p>`
    // await sendMail(req.user.email, "Your order has been placed successfully.", body)
    res.status(201).json({ message: "Order placed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Cannot place order." });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productID");
    res.status(200).json({ message: "Orders Fetched.", orders });
  } catch (error) {
    res.status(500).json({ message: "Cannot get orders." });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );
    if (!order)
      return res.status(404).json({ message: "Order does not found." });
    const user = await User.findById(order.userID)
    const link = `${process.env.BASE_URL}/orders`
    const body = `<p>Dear User, </p>
                  <p>Your order with OrderID: ${order.orderID}, has been ${order.orderStatus}.</p>
                  <p><a href=${link}>Click Here<a> to check out the details.</p>
                  <p>Have a good day.</p>
                  <p>Thank you.</p>`
    await sendMail(user.email, "Your order's status has been updated.", body)
    res.status(200).json({ message: "Status changed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: "Cannot change the status." });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userID: req.user._id }).populate(
      "products.productID"
    );
    res.status(200).json({ message: "Orders fetched successfully.", orders });
  } catch (error) {
    res.status(500).json({ message: "Cannot change the status." });
  }
};

export const dailyOrdersCount = async (req, res) => {
  try {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: date },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json({ message: "Daily orders are fetched.", orders });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Cannot fetch daily orders. Try again.", error });
  }
};

export const orderStatusCount = async (req, res) => {
  try {
    const time = req.params.time;
    let match = {};
    const now = new Date();
    if (time === "15days") {
      const from = new Date();
      from.setDate(now.getDate() - 15);
      match.createdAt = { $gte: from };
    } else if (time === "1month") {
      const from = new Date();
      from.setMonth(now.getMonth() - 1);
      match.createdAt = { $gte: from };
    } else if (time === "3months") {
      const from = new Date();
      from.setMonth(now.getMonth() - 3);
      match.createdAt = { $gte: from };
    }

    const orders = await Order.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$orderStatus",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res
      .status(200)
      .json({
        message: "Product counts fetched according to order status.",
        orders,
      });
  } catch (error) {
    res.status(400).json({ message: "Cannot fetch data. Try again.", error });
  }
};

export const getThisMonthOrdersCount = async (req, res) => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  try {
    const orders = await Order.aggregate([
      {
        $match: { createdAt: { $gte: date } },
      },
      {
        $group: {
          _id: "$orderStatus",
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    const deliveredOrders =
      orders.find((order) => order._id === "Delivered")?.totalOrders || 0;

    const pendingOrders = orders
      .filter((order) => order._id !== "Delivered")
      .reduce((sum, order) => sum + order.totalOrders, 0);

    res.status(200).json({
      deliveredOrders,
      pendingOrders,
      totalOrders: deliveredOrders + pendingOrders,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Cannot fetch monthly orders count.", error });
  }
};

export const searchOrders = async(req, res) => {
  try {
    const query = req.params.query;
    const orders = await Order.find({ $or: [
      { orderID: { $regex: `^${query}`, $options: "i" } },
      { "address.firstName": { $regex: `^${query}`, $options: "i" } },
      { "address.lastName": { $regex: `^${query}`, $options: "i" } },
      { "address.state": { $regex: `^${query}`, $options: "i" } },
      { "address.city": { $regex: `^${query}`, $options: "i" } },
    ]}).populate("products.productID");
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Cannot get orders." });
  }
}

export const filterOrders = async(req, res) => {
  try {
    let status = req.params.status
    if(status === "All"){
      const orders = await Order.find().populate("products.productID")
      return res.status(200).json(orders)
    }
    if(status === "Out-for-Delivery")
      status = "Out for Delivery"  
    const orders = await Order.find({ orderStatus: status }).populate("products.productID")
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: "Cannot get orders" })
  }
}
