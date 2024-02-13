import express, { Request, Response } from 'express';

import llmRoutes from "./routes/llm.routes.js";
import { loadData } from "./controllers/llm.controllers.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

loadData();

// To parse the incoming requests with JSON payloads from request.body
app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, This is a self hostes SLM used to generate very specific responses!');
});

app.use("/api/llm", llmRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});