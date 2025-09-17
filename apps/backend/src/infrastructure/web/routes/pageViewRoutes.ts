import express, { Request, Response, NextFunction } from "express";
import { checkSchema } from "express-validator";
import { pageSchema, statsSchema } from "../schemas/pageViewSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
const router = express.Router();

// Record a page
router.post(
  "/record-view/",
  checkSchema(pageSchema),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const pageViewController = res.locals.container.getPageViewController();
    return pageViewController.recordPage(req, res, next);
  }
);

// Get page stats
router.get(
  "/get-stats/",
  checkSchema(statsSchema),
  validateRequest,
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    const pageViewController = res.locals.container.getPageViewController();
    return pageViewController.getStats(req, res, next);
  }
);
