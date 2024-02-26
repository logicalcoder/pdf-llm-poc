import express, { Request, Response } from 'express';

import llmRoutes from "./routes/llm.routes.js";
import { loadData } from "./controllers/llm.controllers.js";

import dotenv from "dotenv";
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

loadData();

app.use(bodyParser.json());

// To parse the incoming requests with JSON payloads from request.body
app.use(express.json()); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, This is a self hosted SLM used to generate very specific responses!');
});

app.use("/api/llm", llmRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});