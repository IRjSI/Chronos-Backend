import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DBConnection } from "./db/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import taskRouter from "./routes/task.route.js";
import projectRouter from "./routes/project.route.js";
import utilRouter from "./routes/util.route.js";

dotenv.config();

const app = express();

app.set("trust proxy", true);

DBConnection();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "x-auth-csrf-token"],
  })
);
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("/ endpoint...");
});

// routes
/* auth */
app.use("/api/v1/auth", authRouter);
/* tasks */
app.use("/api/v1/tasks", taskRouter);
/* projects */
app.use("/api/v1/projects", projectRouter);
/* report and streak */
app.use("/api/v1/util", utilRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is listening on PORT::", PORT);
});