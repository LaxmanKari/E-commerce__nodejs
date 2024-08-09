import mongoose, { Schema } from "mongoose";

interface IProduct extends Document {
  productId: string;
  productName: string;
  productOwner: string;
  productDescription: string;
  productPrice: number;
  productImage?: string;
  productCondition: string;
  productCategory: string;
}

const ProductSchema = new Schema(
  {
    productName: { type: String, required: true, trim: true, unique: true },
    productOwner: { type: String, required: true },
    productDescription: {
      type: String,
      required: true,
      trim: true,
    },
    productPrice: { type: Number, required: true},
    productImage: { type: String},
    productCondition: { type: String, required: true },
    productCategory: { type: String, required: true },
  },
  { timestamps: true }
);

var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;