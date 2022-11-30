require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto= require("crypto");
const router = express.Router();

router.post("/payment/orders", async (req, res) => {
    // console.log("payment api called");
    try {
        const instance = new Razorpay({
            key_id: process.env.RZP_KEY,
            key_secret: process.env.RZP_SECRET,
        });

        const options = {
            amount: 50000, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);
        console.log(JSON.stringify(order));
        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post("/payment/success", async (req, res) => {
    
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
console.log(`req body is ${orderCreationId} ${razorpayPaymentId} ${razorpayOrderId} ${razorpaySignature}`);
        // Creating our own digest
          const shasum = crypto.createHmac("sha256", process.env.RZP_SECRET);
           shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const generated_signature = shasum.digest("hex");
        // const generated_signature = crypto.createHash('sha256').update(orderCreationId + "|" + razorpayPaymentId, process.env.RZP_SECRET).digest('hex');
console.log(`in success digestt ${generated_signature}`);
        // comaparing our digest with the actual signature
        if (generated_signature !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // TODO: save these details in the database
         res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;