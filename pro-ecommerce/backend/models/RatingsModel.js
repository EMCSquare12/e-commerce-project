import moongoose from "mongoose";

const ratingsSchema = new moongoose.Schema(
    {
        productId: { type: moongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, required: false },
        user: { type: moongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true
    }
);
const Ratings = moongoose.model("Ratings", ratingsSchema);
export default Ratings;