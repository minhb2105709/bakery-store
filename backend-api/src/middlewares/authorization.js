const ApiError = require('../api-error');

async function roleCheck (req, res, next) {
    console.log('User in session:', req.session.user);

    if (!req.session.user) {
        return next(new ApiError(403, 'Unauthorized'));
    }

    userInfo = req.session.user;

    const role_id = userInfo.role_id; 

    if (role_id === 1) {
        return res.redirect('/api/v1/admin');
    } else if (role_id === 0) {
        return res.redirect('/customers');
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
}

async function checkAuthorization (req, res, next) {
    console.log("Session user:", req.session.user);

    if (!req.session.user) {
        return next(new ApiError(403, 'Unauthorized'));
    }
    
    const userInfo = req.session.user;
    const role_id = userInfo.role_id; 

    // Allow access based on role_id
    if (req.originalUrl.startsWith('/api/v1/admin') && role_id !== 1) {
        return res.status(403).json({ message: 'Access denied for non-admin users' });
    } else if (req.originalUrl.startsWith('/customers') && role_id !== 0) {
        return res.status(403).json({ message: 'Access denied for admin users' });
    }

    next();
}

module.exports = {
    roleCheck,
    checkAuthorization,
    
}