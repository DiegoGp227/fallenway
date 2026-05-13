import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { getContributions, getTodayStats } from "./stats.services.js";

export const getContributionsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await getContributions(req.user!.id);
  res.status(200).json(result);
});

export const getTodayStatsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await getTodayStats(req.user!.id);
  res.status(200).json(result);
});
