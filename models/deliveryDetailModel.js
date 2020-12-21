const mongoose = require("mongoose");

const deliveryDetailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Delivery details must belong to a user"]
    },
    address: {
        type: String,
        required: [true, "Delivery details must contain address "]
    },
    phone: {
        type: Number,
        required: [true, "Delivery details must contain a phone number"]
    }
});

const DeliveryDetail = mongoose.model("DeliveryDetail", deliveryDetailSchema);
module.exports = DeliveryDetail;
