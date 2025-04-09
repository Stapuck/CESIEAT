import mongoose, { Schema, Document } from 'mongoose';

interface IArticle extends Document {
    name: string;
    reference: string;
    price: number;
    type : "plat" | "boisson" | "sauce" | "accompagnement" | "dessert" | "snack" | "autre";
    url_image: string;
    restaurantId: mongoose.Types.ObjectId;

}

const articleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        type : {
            type : String,
            enum : ["plat", "boisson", "sauce", "accompagnement", "dessert", "snack", "autre"],
            required : true
        },
        url_image: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: mongoose.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        
    },
    { timestamps: true }
);

const Article = mongoose.model<IArticle>('Article', articleSchema);
export default Article;
