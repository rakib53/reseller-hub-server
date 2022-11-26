const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-node-app.ybb3hyi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const database = client.db("resellerhub");
const category = database.collection("category");
const products = database.collection("products");
const userList = database.collection("users");
const advertises = database.collection("advertises");
const orders = database.collection("orders");

const run = async () => {
  try {
    app.get("/category", async (req, res) => {
      const categoryData = category.find({});
      const result = await categoryData.toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const productsData = products.find({});
      const result = await productsData.toArray();
      res.send(result);
    });

    app.get("/myproducts", async (req, res) => {
      const sellerEmail = req.query?.email;
      let newQuery = {};
      if (req.query?.email) {
        newQuery = {
          sellerEmail: sellerEmail,
        };
      }
      const productsData = products.find(newQuery);
      const result = await productsData.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const data = req.body;
      const query = {
        name: data.name,
        brand: data.brand,
        desc: data.desc,
        image: data.image,
        categoryCode: data.category,
        condition: data.condition,
        location: data.location,
        originalPrice: data.originalPrice,
        sellPrice: data.sellPrice,
        yearOfUsed: data.yearOfUsed,
        sellerName: data.sellerName,
        sellerEmail: data.sellerEmail,
        sellerVerfied: data.sellerVerfied,
        phone: data.phone,
        salesStatus: data.salesStatus,
        postedOn: data.postedOn,
      };
      const result = await products.insertOne(query);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const result = products.deleteOne(query);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          salesStatus: data.salesStatus,
        },
      };
      const result = await products.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.post("/advertises", async (req, res) => {
      const data = req.body;
      // await advertises.insertOne(data);
      // res.send(data);
      console.log(data);
    });

    app.post("/users", async (req, res) => {
      const data = req.body;
      const query = {
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        accountType: data.accountType,
      };
      await userList.insertOne(query);
      res.send(data);
    });

    app.get("/users", async (req, res) => {
      const data = userList.find({});
      const result = await data.toArray();
      res.send(result);
    });

    app.delete("/users/:id", (req, res) => {
      const userId = req.params.id;
      const query = { _id: ObjectId(userId) };
      const deleteUserList = userList.deleteOne(query);
      res.send(deleteUserList);
    });

    //admin role
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          accountType: "admin",
        },
      };
      const result = await userList.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const data = req.body;
      const query = {
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        meetLocation: data.meetLocation,
        productName: data.productName,
        price: data.price,
        productId: data.productId,
        productCategory: data.productCategory,
      };
      const result = await orders.insertOne(query);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

run().catch((err) => {
  console.log(err.message);
});

app.listen(port);
