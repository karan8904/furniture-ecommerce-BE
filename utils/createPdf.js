import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import Charges from "../models/chargesSchema.js";

export const createPdf = async (order) => {
  const createdAt = order?.createdAt ? order.createdAt : "N/A";
  const paymentStatus = order?.paymentStatus || "N/A";
  const totalAmount = order?.totalAmount || 0;
  const taxAmount = Math.round(totalAmount * 9 / 100);
  const platformChargesPercent = await Charges.findOne({ name: "Platform Charge" });
  const deliveryChargesPercent = await Charges.findOne({ name: "Delivery Charge" });
  const deliveryPercent = deliveryChargesPercent?.chargePercent || 0;
  const deliveryCharges = Math.round(totalAmount * (deliveryPercent / 100));
  const platformCharges = Math.round(platformChargesPercent?.chargePercent > 0 ? totalAmount * (platformChargesPercent.chargePercent / 100) : 0);
  const totalAmountAfterTax = Math.round(totalAmount + taxAmount + taxAmount + platformCharges + deliveryCharges);
  const paymentMode = order?.paymentMode !== "COD" ? "Online" : "COD";
  const logoPath = path.join(process.cwd(), "uploads/logo.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

  const html = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Helvetica, sans-serif;
          font-size: 14px;
          padding: 20px;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .logo {
          width: 70px;
          height: 60px;
        }
        .brand {
          font-size: 24px;
          font-weight: bold;
        }
        .title {
          text-align: center;
          margin-top: 5px;
        }
        .section {
          border: 1px solid #ccc;
          padding: 15px;
          margin-bottom: 10px;
        }
        .tableStyle {
          border:1px solid #ccc;
          padding:8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="data:image/png;base64,${logoBase64}" class="logo" alt="logo" />
        <div class="brand">Furniro</div>
      </div>
      <h2 class="title">Order Invoice</h2>
      <hr>
      <div class="section"> 
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${order.address.firstName} ${order.address.lastName}</p>
        <p><strong>Email:</strong> ${order.address.email}</p>
        <p><strong>Phone:</strong> ${order.address.phone}</p>
        <p><strong>Address:</strong> ${order.address.streetAddress}, ${order.address.city}-${order.address.zipCode}, ${order.address.state}, ${order.address.country} </p>
      </div>
      <div class="section">
        <h3>Paymemt Details</h3>
        <p><strong>Ordered On:</strong> ${createdAt}</p>
        <p><strong>Total Amount:</strong> Rs. ${totalAmount}.00</p>
        <p><strong>Payment Mode:</strong> ${paymentMode}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
      </div>
      <div class="section">
        <h3>Order Details</h3>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th class="tableStyle" style="text-align:center;">Item</th>
              <th class="tableStyle" style="text-align:center;">Qty</th>
              <th class="tableStyle" style="text-align:right;">Price</th>
              <th class="tableStyle" style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.products.map(product => 
              `<tr>
                <td class="tableStyle" style="text-align:left;">${product.productID.name}</td>
                <td class="tableStyle" style="text-align:center;">${product.quantity}</td>
                <td class="tableStyle" style="text-align:right;">Rs. ${product.price}.00</td>
                <td class="tableStyle" style="text-align:right;">Rs. ${Math.round(product.quantity * product.price)}.00</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" class="tableStyle" style="text-align:right;">CGST(9%)</td>
              <td class="tableStyle" style="text-align:right;">Rs. ${taxAmount}.00</td>
            </tr>
            <tr>
              <td colspan="3" class="tableStyle" style="text-align:right;">SGST(9%)</td>
              <td class="tableStyle" style="text-align:right;">Rs. ${taxAmount}.00</td>
            </tr>
            <tr>
              <td colspan="3" class="tableStyle" style="text-align:right;">Platform Charges</td>
              <td class="tableStyle" style="text-align:right;">Rs. ${platformCharges}.00</td>
            </tr>
            <tr>
              <td colspan="3" class="tableStyle" style="text-align:right;">Delivery Charges</td>
              <td class="tableStyle" style="text-align:right;">Rs. ${deliveryCharges}.00</td>
            </tr>
            <tr>
              <td colspan="3" class="tableStyle" style="text-align:right; font-weight:bold;">Total</td>
              <td class="tableStyle" style="text-align:right; font-weight:bold;">Rs. ${totalAmountAfterTax}.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="section" style="text-align:center;">
        <p>Thank you for placing order!</p>
      </div>
    </body>
    </html>`;
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const buffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return buffer;
  } catch (error) {
    console.log("Error generating PDF:", error);
    throw error;
  } 
};