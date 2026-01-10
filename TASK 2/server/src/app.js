import express from "express";
const app = express();
import cors from "cors";
import cookie from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import taskRoute from "./routes/task.routes.js";

app.use(express.json());
app.use(cookie());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", userRoute);

app.use("/api/user/task", taskRoute);

export default app;
