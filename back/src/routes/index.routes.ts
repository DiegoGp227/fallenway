import { Router } from "express";
import dbCheck from "../modules/test/test.js";

export const router: Router = Router();

// Test Routes
router.get("/db", dbCheck);