const env = require("dotenv");
const Redis = require("redis");
const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./src/models/userModel");

env.config();
const app = express();

app.use(express.json());

const redisClient = Redis.createClient();

const getCatchedData = async (key, callback) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, result) => {
      if (err) console.error(err);
      if (result != null) return resolve(JSON.parse(result));
      const newResult = await callback();
      redisClient.setex(key, 3600, newResult);
      resolve(newResult);
    });
  });
};

app.get("/redis", async (req, res) => {
  //const users = await userModel.find({ auth: { $exists: true } });
  const result = await getCatchedData("redis", async () => {
    const users = await userModel.find({});
    return users;
  });

  res.send(result);
});

app.get("/", async (req, res) => {
  //const users = await userModel.find({ auth: { $exists: true } });
  const users = await userModel.find({});
  res.send(users);
});

app.get("/:id", async (req, res) => {
  const users = await userModel.findById(req.params.id);
  res.send(users);
});

app.post("/", async (req, res) => {
  const user = new userModel(req.body);
  const result = await user.save();
  res.send(result);
});

app.put("/:id", async (req, res) => {
  const users = await userModel.updateOne({ _id: req.params.id }, req.body);
  res.send(users);
});

app.delete("/:id", async (req, res) => {
  const users = await userModel.deleteOne({ _id: req.params.id });
  res.send(users);
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`server stated at ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
