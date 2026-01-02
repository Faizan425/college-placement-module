//check login
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    next();
};

//  Check if user is an Admin 
const requireAdmin = (req, res, next) => {
    
    const User = require('../models/User'); // Import inside function to avoid circular dependency issues
    
    User.findById(req.session.userId)
        .then(user => {
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ error: 'Access Denied: Admins Only' });
            }
            next();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Server Error during Auth' });
        });
};


module.exports = { requireAuth, requireAdmin };