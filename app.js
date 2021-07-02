///////// imports ////////////
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import TourRouter from "./routes/tour.routes.js";
import UserRouter from "./routes/user.routes.js";

dotenv.config({ path: "./config.env" });

///////// end imports //////////

const app = express();

//// 1)middlewares ////////

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

////// Routers ////////

app.use("/api/v1/tours", TourRouter);
app.use("/api/v1/users", UserRouter);

////////////// FallBack Tour ////////////////

app.use("*", (req, res) => {
  res.status(404).json({
    status: "resource do not exits",
  });
});

export default app;
