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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`running at http://localhost:${port}`);
});
