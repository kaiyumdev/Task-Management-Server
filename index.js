require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
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
        // const userDB = client.db("userDB");
        const taslCollection = taskDB.collection("taslCollection");
        // console.log(taslCollection)
        // const userCollection = userDB.collection("userCollection");

        // // Services
        app.post("/tasks", async (req, res) => {
            const taskData = req.body;
            console.log(taskData)
            const result = await taslCollection.insertOne(taskData);
            res.send(result);
        });

        app.get("/tasks", async (req, res) => {
            const taskData = taslCollection.find();
            console.log(taskData)
            const result = await taskData.toArray();
            res.send(result);
        });

        // app.get("/services/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const result = await serviceCollection.findOne({ _id: new ObjectId(id) });
        //     res.send(result);
        // });

        // app.patch("/services/:id", verifyToken, async (req, res) => {
        //     const id = req.params.id;
        //     const updateService = req.body;
        //     const result = await serviceCollection.updateOne(
        //         { _id: new ObjectId(id) },
        //         { $set: updateService }
        //     );
        //     res.send(result);
        // });

        // app.delete("/services/:id", verifyToken, async (req, res) => {
        //     const id = req.params.id;
        //     const result = await serviceCollection.deleteOne({ _id: new ObjectId(id) });
        //     res.send(result);
        // });

        // // Users
        // app.post("/user", async (req, res) => {
        //     const userData = req.body;
        //     const token = createToken(userData);
        //     const isUserExist = await userCollection.findOne({ email: userData?.email });
        //     if (isUserExist?._id) {
        //         return res.send({
        //             status: "success",
        //             message: "Login success",
        //             token,
        //         });
        //     }
        //     await userCollection.insertOne(userData);
        //     return res.send({ token });
        // });

        // app.get("/user/get/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const result = await userCollection.findOne({ _id: new ObjectId(id) });
        //     res.send(result);
        // });

        // app.get("/user/:email", async (req, res) => {
        //     const email = req.params.email;
        //     const result = await userCollection.findOne({ email });
        //     res.send(result);
        // });

        // app.patch("/user/:email", verifyToken, async (req, res) => {
        //     const email = req.params.email;
        //     const userData = req.body;
        //     const result = await userCollection.updateOne(
        //         { email },
        //         { $set: userData },
        //         { upsert: true }
        //     );
        //     res.send(result);
        // });

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
