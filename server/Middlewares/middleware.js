/**Checks if user is logged in */
export function isLoggedIn(req, res, next) {
  if (req.session) {
    next();
  } else {
    res.status(401).json({ isLoggedIn: false });
  }
}
