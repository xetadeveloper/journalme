// Modules
import { Router } from 'express';

// Middleware

const router = Router();

router.post('/login', (req, res) => {
  // Check database for user
  console.log('Hit Login Route: ', req.body);
  res.status(200).json({
    app: {
      isLoggedIn: true,
    },
    flags: {},
  });
});

export { router as postRouter };

// Error format for forms
// error: [
//     { field: 'username', message: 'User does not exist' },
//     { field: 'password', message: 'Password Incorrect' },
//   ],
