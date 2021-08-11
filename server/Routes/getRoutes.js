// Modules
import { Router } from 'express';

// Middleware
// import { isLoggedIn } from "../Middlewares/middleware.js";

const router = Router();

router.get('/serverhealth', (req, res) => {
  res.status(200).send('Server is healthy.....');
});

// For restoring session
router.get('/restoreSession', (req, res) => {
  console.log('Restore Session Route called....');
  // Check the session store if there's any session available
  res.status(200).send({
    app: { isLoggedIn: false, user: 'lind' },
    flags: { isSessionRestored: false },
  });
});

export { router as getRoutes };
