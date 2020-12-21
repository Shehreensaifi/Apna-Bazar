const mongoose = require("mongoose");
const productSchema = require("./productModel").schema;
const deliveryDetailSchema = require("./deliveryDetailModel").schema;

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "An order must belong to a user"]
    },
    product: {
        type: productSchema,
        required: [true, "An order must belong to a product"]
    },
    address: {
        type: deliveryDetailSchema,
        required: [true, "An order must have an address"]
    },
    quantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        default: function() {
            return this.product.price * this.quantity;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "pending",
        //User can set it cancelled or removed but Seller can set it to any except removed
        enum: ["pending", "confirmed", "delivered", "cancelled", "removed"]
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

orderSchema.pre(/^find/, function(next) {
    this.populate("user").populate("product.seller");
    next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
