export const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Please login first' });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Please login first' });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only' });
  }
  next();
};
