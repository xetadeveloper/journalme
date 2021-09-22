/**Checks if user is logged in */
export function isLoggedIn(req, res, next) {
  if (req.session.userID) {
    // console.log('user was logged in')
    next();
  } else {
    // console.log('user was not logged in')
    res.status(401).json({ app: { isLoggedIn: false } });
  }
}
