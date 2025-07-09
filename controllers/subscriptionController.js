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
        { upsert: true, new: true }
        );
    
        console.log(stripeSubscription);
        res.status(200).json({ message: "Subscription confirmed and saved.", updatedSubscription });
    } catch (error) {
        res.status(500).json("Cannot confirm subscription.")
    }
}
