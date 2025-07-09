import Subscription from "../models/subscriptionSchema.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY);
export const confirmSubscription = async(req, res) => {
    try {
        const id = req.params.id
        const session = await stripe.checkout.sessions.retrieve(id);
        let invoiceUrl = null;
        if (session.invoice) {
        const invoice = await stripe.invoices.retrieve(session.invoice);
            invoiceUrl = invoice.hosted_invoice_url;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

        const updatedSubscription = await Subscription.findOneAndUpdate(
        { userID: req.user._id },
        {
            userID: req.user._id,
            subscriptionID: stripeSubscription.id,
            priceID: stripeSubscription.plan.id,
            status: stripeSubscription.status,
            startDate: new Date(stripeSubscription.start_date * 1000),
            invoiceUrl: invoiceUrl,
        },
        { new: true }
        );
    
        res.status(200).json({ message: "Subscription confirmed and saved.", updatedSubscription });
    } catch (error) {
        res.status(500).json("Cannot confirm subscription.")
    }
}

export const getSubscriptionDetails = async(req, res) => {
    try {
        const priceID = req.params.id
        const userID = req.user._id
        const subscription = await Subscription.findOne({ priceID: priceID, userID: userID })
        res.status(200).json({ message: "Details fetched successfully.", subscription })
    } catch (error) {
        res.status(500).json("Cannot fetch details.")
    }
}

export const cancelSubscription = async(req, res) => {
    try {
        const priceID = req.params.id
        const userID = req.user._id
        const subscription = await Subscription.findOne({ priceID: priceID, userID: userID })
        if(!subscription || !subscription.subscriptionID)
            return res.status(404).json({ message: "No subscription found." })
        const cancelSubscription = await stripe.subscriptions.update(subscription.subscriptionID, { cancel_at_period_end: true })
        subscription.cancelAtPeriodEnd = cancelSubscription.cancel_at_period_end
        await subscription.save()
        res.status(200).json({ message: "Subscription cancelled successfully.", subscription });
    } catch (error) {
        res.status(500).json("Cannot cancel subscription.")
    }
}