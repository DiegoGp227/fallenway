import { Router } from "express";
import dbCheck from "../modules/test/test.js";
import { signup } from "../modules/auth/auth.controllers.js";

export const router: Router = Router();

// Test Routes
router.get("/db", dbCheck);

//Auth Routes
router.get("/signup", signup);
