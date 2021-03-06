const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Posts
router.get("/", async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

// Add Posts
router.post("/", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date(),
  });
  res.status(200).send();
});

// Edit Posts
router.put("/:id/edit", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    { $set: { text: req.body.text, createdAt: new Date() } }
  );
  res.status(200).send();
});

// Delete Posts
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
  res.status(200).send();
});

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://will:mongodb1234@vueexpress.cnplart.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  );
  return client.db("vueexpress").collection("posts");
}

module.exports = router;
