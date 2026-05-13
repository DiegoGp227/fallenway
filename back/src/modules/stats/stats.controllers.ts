import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { getContributions } from "./stats.services.js";

export const getContributionsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await getContributions(req.user!.id);
  res.status(200).json(result);
});
