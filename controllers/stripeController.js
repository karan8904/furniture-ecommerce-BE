import Subscription from '../models/subscriptionSchema.js'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY);

export const stripeWebhooks = async(req, res) => {
    const sig = req.headers["stripe-signature"]
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
        if(event.type === "customer.subscription.created" || event.type === "customer.subscription.updated"){
            const subscription = event.data.object

            let hostedInvoiceUrl = null;
            if (subscription.latest_invoice) {
                const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
                hostedInvoiceUrl = invoice.hosted_invoice_url;
            }

            await Subscription.findOneAndUpdate(
                {subscriptionID: subscription.id},
                {
                    status: subscription.status,
                    priceID: subscription.plan.id,
                    startDate: new Date(subscription.start_date * 1000),
                    invoiceUrl: hostedInvoiceUrl
                },
            )
            console.log("Subscription Updated.", subscription.id)
        }
        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;
    
            await Subscription.findOneAndUpdate(
              { subscriptionID: subscription.id },
              { status: "cancelled" }
            );
    
            console.log("Subscription cancelled:", subscription.id);
          }
    
          res.json({ received: true });
    
    } catch (error) {
         res.status(400).send(`Webhook Error: ${error.message}`);
    }
}