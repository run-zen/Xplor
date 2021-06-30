///////// imports ////////////
import express from "express";
import morgan from "morgan";
import TourRouter from "./routes/tour.routes.js";
import UserRouter from "./routes/user.routes.js";

///////// end imports //////////

const app = express();

//// middlewares ////////

app.use(morgan("dev"));
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

export { app };
