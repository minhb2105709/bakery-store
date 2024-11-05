const ApiError = require('../api-error'); // Lớp lỗi tuỳ chỉnh của bạn
const JSend = require('../jsend'); // Định dạng JSON tuỳ chỉnh của bạn
const authService = require('../models/auth.model');
const bcrypt = require('bcrypt'); // mã hoá mật khẩu

async function login(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ApiError(400, 'Username and password are required'));
    }

    try {
        const user = await authService.login(username, password);

        if (!user) {
            return next(new ApiError(401, 'Invalid username or password'));
        }

        // Store user information in the session
        req.session.user = {
            id: user.user_id,
            role_id: user.user_role, // Assuming user_role corresponds to role_id
            username: user.user_name,
        };

        return res.json(
            JSend.success({
                message: 'Login successful, Hello ' + user.user_name,
                user: {
                    id: user.id,
                    name: user.user_name,
                    role: user.user_role,
                },
            })
        );
    } catch (error) {
        console.log(error);
        return next(new ApiError(401, 'Invalid username or password'));
    }
}

async function register(req, res, next) {
    const { username, password, userPhone } = req.body;

    if (!username || !password || !userPhone) {
        return next(new ApiError(400, 'Please provide username, password, and phone number for register'));
    }

    try {
        // checking for existing account
        const existingUser = await authService.checkAccount(username);
        if (existingUser) {
            return next(new ApiError(400, 'Account already exists!! Pleased Try Again'));
        }

        const registerData = {
            username: username,
            password: password, // Sử dụng password gốc
            userPhone: userPhone
        }

        await authService.register(registerData);

        return res.status(201).json(
            JSend.success({
                message: `Registration successful!! Hello ${registerData.username}`,
                user: {
                    phone: registerData.userPhone,
                }
            })
        );

    } catch (error) {
        console.log(error);
        return next(new ApiError(401, 'Register Failed'));
    }
}

async function logout(req, res) {
    req.session.destroy();
    return res.status(200).json(JSend.success({ message: 'Logout successful' }));
}

module.exports = {
    login,
    register,
    logout,
};