const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

// interface IProduct extends Document {
//   productId: string;
//   productName: string;
//   productOwner: string;
//   productDescription: string;
//   productPrice: number;
//   productImage?: string;
//   productCondition: string;
//   productCategory: string;
// }

const ProductSchema = new Schema(
  {
    productName: { type: String, required: true, trim: true, unique: true },
    productOwner: { type: String, required: true },
    productDescription: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    productPrice: [{ type: String, required: true, ref: "Product" }],
    productImage: [{ type: String, ref: "Product" }],
    productCondition: [{ type: String, ref: "Product", required: true }],
    productCategory: { type: String, required: true },
  },
  { timestamps: true }
);

var Product = mongoose.model("User", ProductSchema);
module.exports = Product;