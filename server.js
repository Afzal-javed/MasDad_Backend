import express from "express"
import dotenv from "dotenv"
import "./DB/connection.js";
import cors from "cors"
import userRoute from "./routes/userRoute.js";
import pdfRoute from "./routes/pdfRoutes.js";
import detailRoute from "./routes/detailRoute.js";
import bodyParser from "body-parser";

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/user", userRoute);
app.use("/api/pdf", pdfRoute);
app.use("/api/package", detailRoute);

app.get("/", (req, res) => {
    res.send("Welcome to my world");
})
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})