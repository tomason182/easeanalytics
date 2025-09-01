import express, { Request, Response, NextFunction } from "express";
import { websiteSchema } from "../schemas/websiteSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { checkSchema, param } from "express-validator";

const router = express.Router();

// add a new website
router.post(
  "/website/",
  authMiddleware,
  checkSchema(websiteSchema),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const websiteController = res.locals.container.getWebsiteController();
    return websiteController.addWebsite(req, res, next);
  }
);

// update a website
router.put(
  "/website/:id",
  authMiddleware,
  checkSchema(websiteSchema),
  param("id")
    .trim()
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("id must be a positive integer"),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const websiteController = res.locals.container.getWebsiteController();
    return websiteController.updateWebsite(req, res, next);
  }
);

// delete a website
router.delete(
  "/website/:id",
  authMiddleware,
  param("id")
    .trim()
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("id must be a positive integer"),
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    const websiteController = res.locals.container.getWebsiteController();
    return websiteController.deleteWebsite(req, res, next);
  }
);
