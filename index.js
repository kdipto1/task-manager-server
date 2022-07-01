const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//mongodb start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qjyt1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("scTask").collection("tasks");
    const completedTaskCollection = client.db("scTask").collection("completed");

    //post task
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });
    app.post("/completedTask", async (req, res) => {
      const completedTask = req.body;
      const result = await completedTaskCollection.insertOne(completedTask);
      res.send(result);
    });
    app.get("/allTasks", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/completedTasks", async (req, res) => {
      const query = {};
      const cursor = completedTaskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: { task: data.task } };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Working port: ${port}`);
});
