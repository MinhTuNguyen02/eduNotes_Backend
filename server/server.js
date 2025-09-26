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

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME, 
  })
    .then(()=>console.log("MongoDB connected"))
    .catch(err=>console.log("Mongo error", err.message));

app.listen(process.env.PORT, ()=>console.log(`API on ${process.env.PORT}`));