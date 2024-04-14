import Express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import cors from "cors";
const app = Express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(Express.json());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static("public"));

import UserRoute from "./Routes/User.Route.js";
import JobRoute from "./Routes/Job.route.js";
import ApplicationRoute from "./Routes/Application.route.js";
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/job", JobRoute);
app.use("/api/v1/application", ApplicationRoute);

export { app };