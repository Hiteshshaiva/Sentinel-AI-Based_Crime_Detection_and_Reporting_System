require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let collection;

async function connectDB() {
    try {
        await client.connect();

        console.log("MongoDB Connected");

        const db = client.db(process.env.DB_NAME);

        collection = db.collection(process.env.COLLECTION_NAME);

    } catch (err) {
        console.log(err);
    }
}

connectDB();


// GET ALL REPORTS

app.get("/reports", async (req, res) => {
  try {
    const reports = await collection
      .find()
      .sort({ timestamp: -1 })
      .toArray();

    res.json(
      reports.map((r) => ({
        id: r._id.toString(),
        crime_type: r.crime_type,
        location: r.location,
        description: r.description,
        latitude: r.latitude,
        longitude: r.longitude,
        timestamp: r.timestamp,
      }))
    );
  }catch (err) {
    console.error("MongoDB Connection Error:");
    console.error(err);
    process.exit(1);
}
});


// ADD REPORT

app.post("/reports", async (req, res) => {

    const report = {

        crime_type: req.body.crime_type,

        location: req.body.location,

        description: req.body.description,

        latitude: req.body.latitude,

        longitude: req.body.longitude,

        timestamp: new Date()

    };

    const result = await collection.insertOne(report);

    res.status(201).json({
  id: result.insertedId.toString(),
  ...report,
});

});


// DELETE REPORT

app.delete("/reports/:id", async (req, res) => {
  try {
    await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {

    console.log(`Server running on port ${process.env.PORT}`);

});