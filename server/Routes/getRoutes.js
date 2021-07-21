// Modules
import { Router } from "express";

// Middleware
// import { isLoggedIn } from "../Middlewares/middleware.js";

const router = Router();

router.get("/serverhealth", (req, res) => {
  res.status(200).send("Server is healthy.....");
});

router.get("/restoreSession", (req, res) => {
  console.log("Restore Session ROute called....");
  res
    .status(200)
    .send({
      app: { isLoggedIn: true, user: "lind" },
      flags: { isSessionRestored: true },
    });
});

export { router as getRouter };
