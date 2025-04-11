const isAdmin = (req, res, next) => {
    const user = req.user;
  
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    // Check if user has 'ADMIN' role
    if (user.role !== 'ADMIN') {
        console.log('User role:', user.role); // Log the user role for debugging
        console.log('User ID:', user.id); // Log the user ID for debugging
        console.log('User:', user); // Log the entire user object for debugging  
        return res.status(403).json({ message: "Forbidden: Admins only." });
    }
  
    next();
};

module.exports = isAdmin;
