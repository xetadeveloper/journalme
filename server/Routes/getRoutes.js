// Modules
import { Router } from "express";

// Middleware
// import { isLoggedIn } from "../Middlewares/middleware.js";

const router = Router();

router.get("/serverhealth", (req, res) => {
  res.status(200).send("Server is healthy.....");
});

router.get("checkSession", (req, res) => {
  res.status(200).send({});
});
export { router as getRouter };
