import { NextFunction } from "express";

const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const { Product } = require("../schemas/ProductSchema");
const { User } = require("../schemas/UserSchema");
import { IproductSearchByName } from "../types/product.types";

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req: any, res: any, next: NextFunction) => {
  try {
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).send("User not logged In");
    }
    const products = await Product.find({
      productOwner: { $ne: loggedInUserEmail },
    });
    res.json(products);
  } catch (error) {
    res.status(503).json({ message: "Error fetching products", error });
  }
});

router.get("/product", async (req: any, res: any, next: NextFunction) => {
  try {
    const productName = req.query.productName;
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(500).send("Bad Request");
    }
    const query: IproductSearchByName = {
      productOwner: { $ne: loggedInUserEmail },
    } as unknown as IproductSearchByName;
    if (productName) {
      query.productName = {
        $regex: new RegExp(productName, "i"),
      } as unknown as string;
    }
    const products = await Product.find(query);
    if (products.length === 0) {
      res.json({ message: "Oops, No related products found" });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching products", error });
  }
});

router.get("/product/filter", async (req: any, res: any, next: NextFunction) => {
  try {
    const category = req.query.productCategory;
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).send("User not logged In");
    }

    if (category) {
      const products = await Product.find({productCategory: category});
      if (products.length === 0) {
        res.json({ message: "Oops, No related products found with this category" });
      } else {
        return res.json(products);
      }
    }
    else{
      res.json({ message: "Oops, Category is not provided, please provide one" });
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching products", error });
  }
});

router.get("/product/sort", async (req: any, res: any, next: NextFunction) => {
  try {
    const sortOrder = req.query.productPrice;
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).send("User not logged In");
    }

    const validSortOrders = ['asc', 'desc'];
    if (sortOrder) {
      const products = await Product.find({});
      if (products.length === 0) {
        res.json({ message: "Oops, No related products found with this category" });
      } else {
        const sortDirection = sortOrder === 'asc' ? 1 : -1; 
        let sortedProducts = [];
        if(sortOrder && validSortOrders.includes(sortOrder as string)){
          sortedProducts = await Product.find().sort({productPrice: sortDirection})
        }
        return res.json(sortedProducts);
      }
    }
    else{
      res.json({ message: "Oops, SortBy is not provided, please provide one" });
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching products", error });
  }
});

router.post("/add", async (req: any, res: any, next: NextFunction) => {
  var payload = req.body;
  const loggedInUserEmail = req.session.user.userEmail;
  const productName = req.body.productName;
  const productOwner = loggedInUserEmail;
  const productDescription = req.body.productDescription;
  const productPrice = req.body.productPrice;
  const productCondition = req.body.productCondition;
  const productCategory = req.body.productCategory;

  if (
    productCategory &&
    productCondition &&
    productDescription &&
    productName &&
    productOwner &&
    productPrice
  ) {
    payload.message = "about to add in db";
    try {
      const newProduct = new Product({
        productName,
        productCategory,
        productCondition,
        productDescription,
        productOwner,
        productPrice,
      });

      await newProduct.save();
      res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error adding product to db", error });
    }
  } else {
    res
      .status(400)
      .json({ message: "Make sure all the details are provided correctly" });
  }
});

router.get("/cart", async (req: any, res: any, next: NextFunction) => {
  try {
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).json({ message: "Please login" });
    }

    const populateUserCartItems = await User.findOne({
      userEmail: loggedInUserEmail,
    })?.populate("userCart");
    if (!populateUserCartItems) {
      return res.status(404).json({ message: "No Products, cart empty" });
    }
    if (populateUserCartItems.userCart.length === 0) {
      return res.status(404).json({ message: "No Products, wishlist empty" });
    } else {
      res.json(populateUserCartItems.userCart);
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching cart items", error });
  }
});

router.post("/cart/add", async (req: any, res: any, next: NextFunction) => {
  try {
    const itemId = req.body.itemId;
    const loggedInUserEmail = req.session.user.userEmail;

    if (!loggedInUserEmail) {
      return res.status(401).json({ message: "Please login" });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "Please provide the product id in order to add to cart",
      });
    }
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findOne({ userEmail: loggedInUserEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userCart.includes(itemId)) {
      return res.status(400).json({ message: "Product already in the cart" });
    }

    user.userCart.push(itemId);
    await user.save();
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart", error });
  }
});

router.get("/wishlist", async (req: any, res: any, next: NextFunction) => {
  try {
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).json({ message: "Please login" });
    }

    const populateUserWishListItems = await User.findOne({
      userEmail: loggedInUserEmail,
    })?.populate("userWishList");
    if (!populateUserWishListItems) {
      return res.status(404).json({ message: "No Products, wishlist empty" });
    }
    if (populateUserWishListItems.userWishList.length === 0) {
      return res.status(404).json({ message: "No Products, wishlist empty" });
    } else {
      res.json(populateUserWishListItems.userWishList);
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching cart items", error });
  }
});

router.post("/wishlist/add", async (req: any, res: any, next: NextFunction) => {
  try {
    const itemId = req.body.itemId;
    const loggedInUserEmail = req.session.user.userEmail;

    if (!loggedInUserEmail) {
      return res.status(401).json({ message: "Please login" });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "Please provide the product id in order to add to cart",
      });
    }
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findOne({ userEmail: loggedInUserEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userWishList.includes(itemId)) {
      return res
        .status(400)
        .json({ message: "Product already in the wishlist" });
    }

    user.userWishList.push(itemId);
    await user.save();
    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product to wishlist", error });
  }
});

router.get("/inventory", async (req: any, res: any, next: NextFunction) => {
  try {
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).json({ message: "Please login" });
    }

    const userInventoryItems = await Product.find({
      productOwner: loggedInUserEmail,
    });
    if (!userInventoryItems) {
      return res.status(404).json({ message: "No Products" });
    }
    if (userInventoryItems.length === 0) {
      return res.status(404).json({
        message:
          "No Products, inventory is empty, please add your products for sale",
      });
    } else {
      res.json(userInventoryItems);
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching inventory items", error });
  }
});

router.delete(
  "/inventory/product",
  async (req: any, res: any, next: NextFunction) => {
    try {
      const productId = req.query.productId;
      const loggedInUserEmail = req.session.user.userEmail;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      //Ensure whether user owns this product
      if (product.productOwner !== loggedInUserEmail) {
        return res.statusMessage(403).json({
          message:
            "Yo do not have permission to delete this product, product is owned by :",
          product,
        });
      }

      await Product.findByIdAndDelete(productId);

      res
        .status(200)
        .json({ message: "Product deleted successfully", product });
    } catch (error) {
      res
        .status(503)
        .json({ message: "Error fetching inventory items", error });
    }
  }
);

router.put(
  "/inventory/update",
  async (req: any, res: any, next: NextFunction) => {
    try {
      const productId = req.query.productId;
      const updatedProduct = req.body;
      const loggedInUserEmail = req.session.user.userEmail;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      //Ensure whether user owns this product
      if (product.productOwner !== loggedInUserEmail) {
        return res.status(200).json({
          message:
            "Yo do not have permission to delete this product, product is owned by :",
        });
      }

      const newUpdatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedProduct,
        {
          new: true,
          runVlidators: true,
        }
      );

      if (!newUpdatedProduct) {
        return res.status(500).json({ message: "Error updating product" });
      }

      res
        .status(200)
        .json({ message: "Product updated successfully", newUpdatedProduct });
    } catch (error) {
      res
        .status(503)
        .json({ message: "Error fetching inventory items", error });
    }
  }
);

router.post("/checkout", async (req: any, res: any, next: NextFunction) => {
  try {
    const loggedInUserEmail = req.session.user.userEmail;
    if (!loggedInUserEmail) {
      res.status(401).json({ message: "Please login" });
    }

    const populateUserCartItems = await User.findOne({
      userEmail: loggedInUserEmail,
    })?.populate("userCart");
    if (!populateUserCartItems) {
      return res.status(404).json({ message: "No Products, cart empty" });
    }
    if (populateUserCartItems.userCart.length === 0) {
      return res.status(404).json({ message: "No Products, empty" });
    } else {
      let totalCost = 0;
      const size = populateUserCartItems.userCart.length;
      for (let i = 0; i < size; i++) {
        totalCost += populateUserCartItems.userCart[i].productPrice;
      }
      res.json({
        message: `Total price is : , ${totalCost}, Payment transaction initiating`,
      });
    }
  } catch (error) {
    res.status(503).json({ message: "Error fetching cart items", error });
  }
});

module.exports = router;
