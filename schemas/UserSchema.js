const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

// interface User {
//   userName: string;
//   userEmail: string;
//   userPasswordHash: string;
//   userProfilePicture?: string;
//   userProducts?: mongoose.Schema.Types.ObjectId[];
//   userCart?: mongoose.Schema.Types.ObjectId[];
//   userProductWishList?: mongoose.Schema.Types.ObjectId;
// }

const UserSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true, unique: true },
    userEmail: { type: String, required: true, trim: true, unique: true },
    userPasswordHash: { type: String, required: true },
    userProfilePicture: { type: String, default: "/images/profilePic.jpeg" },
    userProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    userCart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    userWishList: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

var User = mongoose.model('User', UserSchema); 
module.exports = User; 
