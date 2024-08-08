const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Product = require("../schemas/ProductSchema");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {});

router.post("/add", async (req, res, next) => {
  var payload = req.body;

  const productName = req.body.productName;
  const productOwner = req.body.productOwner;
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
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error adding product to db", error });
    }
  } 
  else {
    res.status(400).json({ message: "Make sure all the details are provided correctly"});
  }
});

module.exports = router;

