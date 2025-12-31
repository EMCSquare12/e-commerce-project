import { mongoose } from "mongoose"
const notificationsSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["order", "user", "product", "system", "alert"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: "/"
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },
    read: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
}
)

const Notifications = mongoose.model("Notifications", notificationsSchema)
export default Notifications