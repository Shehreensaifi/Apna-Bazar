const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    name: { type: String, required: [true, "A shop must have a name"] },
    image: { type: String, required: [true, "A shop must have an image"] },
    // imageId: {
    //     type: String,
    //     required: [true, "ImageId required"]
    // },
    // seller: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: [true, "Shop must belong to a seller"]
    // },
    location: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String
    }
});

shopSchema.index({ location: "2dsphere" });

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
