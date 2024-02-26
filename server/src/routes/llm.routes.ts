import express from "express";
import { findResult } from "../controllers/llm.controllers.js";

const router = express.Router();

router.post("/findResult", findResult);

export default router;