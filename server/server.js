import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose"
import { APIs_V1 } from "./src/routes/index.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json());
app.use(morgan("dev"));

app.use(APIs_V1);
app.get("/health", (_, res) => res.json({ ok: true }));

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME, 
  })
    .then(()=>console.log("MongoDB connected"))
    .catch(err=>console.log("Mongo error", err.message));

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`API on ${port}`));