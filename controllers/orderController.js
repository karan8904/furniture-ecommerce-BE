import { v4 } from "uuid";
import Cart from "../models/cartSchema.js";
import Order from "../models/orderSchema.js";

export const createOrder = async(req, res) => {
    try {
        const {userID, products, totalAmount, address, paymentMode} = req.body
        if(!req.user._id.equals(userID))
            return res.status(401).json({ message: "Not Authorized." })
        const paymentStatus = "Pending"
        const orderStatus = "Placed"
        const orderID = v4()
        const order = new Order({ userID, products, totalAmount, address, paymentMode, paymentStatus, orderStatus, orderID })
        await order.save()
        await Cart.deleteMany({ userID: userID })
        res.status(201).json({ message: "Order placed successfully." })
    } catch (error) {
        res.status(500).json({ message: "Cannot place order." })
    }
}

export const getOrders = async(req, res) => {
    try {
        const orders = await Order.find().populate("products.productID")
        res.status(200).json({ message: "Orders Fetched.", orders })
    } catch (error) {
        res.status(500).json({ message: "Cannot get orders." })        
    }
}

export const changeStatus = async(req, res) => {
    try {
        const { id, status } = req.body
        const order = await Order.findByIdAndUpdate(id, {orderStatus: status}, {new: true})
        if(!order)
            return res.status(404).json({ message: "Order does not found." })
        res.status(200).json({ message: "Status changed successfully.", order })
    } catch (error) {
        res.status(500).json({ message: "Cannot change the status." })
    }
}

export const getMyOrders = async(req, res) => {
    try {
        const orders = await Order.find({ userID: req.user._id }).populate("products.productID")
        res.status(200).json({ message: "Orders fetched successfully.", orders })
    } catch (error) {
        res.status(500).json({ message: "Cannot change the status." })
    }
}

export const dailyOrdersCount = async(req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt"}},
                    totalOrders: { $sum: 1}
                },
            },
            {
                $sort: { _id: 1 }
            }
        ])
        res.status(200).json({ message: "Daily orders are fetched.", orders })
    } catch (error) {
        res.status(400).json({ message: "Cannot fetch daily orders. Try again.", error })        
    }
}

export const orderStatusCount = async(req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 } 
            }
        ])

        res.status(200).json({ message: "Product counts fetched according to order status.", orders })
    } catch (error) {
        res.status(400).json({ message: "Cannot fetch data. Try again.", error })
    }
}