import Express from "express";
import cookieParser from "cookie-parser";

import cors from "cors";
const app = Express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://job-board-frontend-teal.vercel.app"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(
  cors({
    origin: ["https://job-board-frontend-teal.vercel.app", /vercel\.app$/],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE"],
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
