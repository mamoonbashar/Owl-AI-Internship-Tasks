import express from "express";
const app = express();
import cors from "cors";
import cookie from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import taskRoute from "./routes/task.routes.js";

app.use(express.json());
app.use(cookie());
app.use(cors());
app.use("/user", userRoute);

app.use("/user/task", taskRoute);

export default app;
