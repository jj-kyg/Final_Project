function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401)
    next({
      name: "MissingUserError",
      message: "You must be logged in perform this action"
    });
  }
  
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    res.status(401)
    next({
      name: "MissingUserError",
      message: "You must be logged in asAdmin perform this action"
    });
  }
  
  next();
}

module.exports = {
  requireUser
}