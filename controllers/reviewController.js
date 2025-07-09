import Review from '../models/reviewSchema.js'

export const createReview = async(req, res) => {
    try {
        const { productID, ratingScore, description } = req.body
        const review = new Review({ userID: req.user._id, productID, description, ratingScore })
        await review.save()
        res.status(201).json({ message: "Review posted successfully.", review })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Cannot post the review. Try again." })
    }
}

export const getReviews = async(req, res) => {
    try {
        const productID = req.params.productID
        const reviews = await Review.find({ productID }).sort({ "createdAt": -1 })
        if(!reviews)
            return res.status(200).json({ message: "Reviews fetched successfully.", reviews: [] })
        await Review.populate(reviews, { path: "userID", select: "firstName profilePicture" })
        res.status(200).json({ message: "Reviews fetched successfully.", reviews })
    } catch (error) {
        res.status(500).json({ message: "Cannot fetch the reviews. Try again." })
    }
}