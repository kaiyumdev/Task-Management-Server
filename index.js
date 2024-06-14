require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const port = process.env.PORT || 3000;
const userName = process.env.DB_USERNAME;
const userPassword = process.env.DB_PASSWORD;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.40hja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const taskDB = client.db("taskDB");
        const taslCollection = taskDB.collection("taslCollection");

        // // Services
        app.post("/tasks", async (req, res) => {
            const taskData = req.body;
            const result = await taslCollection.insertOne(taskData);
            res.send(result);
        });

        app.get("/tasks", async (req, res) => {
            const taskData = taslCollection.find();
            const result = await taskData.toArray();
            res.send(result);
        });

        // app.get("/tasks/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const result = await taslCollection.findOne({ _id: new ObjectId(id) });
        //     res.send(result);
        // });

        app.patch("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const updateTask = req.body;
            console.log(updateTask)
            const result = await taslCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateTask }
            );
            res.send(result);
        });

        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const result = await taslCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure proper cleanup
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is Task-Management Server by Mine Seriously!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
