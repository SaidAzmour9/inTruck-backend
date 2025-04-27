const isAdmin = (req, res, next) => {
    const user = req.user;
  
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    // Check if user has 'ADMIN' role
    if (user.role !== 'ADMIN') {
        
        return res.status(403).json({ message: "Forbidden: Admins only." });
    }
  
    next();
};

module.exports = isAdmin;
