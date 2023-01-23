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
  // console.log('Restore Session Route called....');
  // Check the session store if there's any session available
  if (req.session.userID) {
    res.status(200).send({
      app: {
        isLoggedIn: true,
        userInfo: { username: req.session.username, _id: req.session.userID },
      },
      flags: { isSessionRestored: true },
    });
  } else {
    res.status(401).send({
      app: { isLoggedIn: false },
      flags: { isSessionRestored: false, loginRedirect: true },
    });
  }
});

export { router as getRoutes };
