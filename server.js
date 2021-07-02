import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!......"));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

const TourModel = new mongoose.model("Tour", tourSchema);

const testTour = new TourModel({
  name: "The Park Camper",
  price: 299,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log("Error :", err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running at http://localhost:${port}`);
});
