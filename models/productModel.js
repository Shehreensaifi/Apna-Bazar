const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "A product must have a name"] },
    price: { type: Number, required: [true, "A product must have a price"] },
    image: { type: String, required: [true, "A product must have an image"] },
    imageId: {
        type: String,
        required: [true, "ImageId required"]
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Product must belong to a seller"]
    }
});

productSchema.pre(/^find/, function(next) {
    this.populate({
        path: "seller",
        select: "name email"
    });
    next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
