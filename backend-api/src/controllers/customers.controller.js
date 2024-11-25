const JSend = require('../jsend');
const customer = require('../models/customer.model');
const ApiError = require('../api-error');



// User Information Update API
// http://localhost:3000/customers/update_user_info/
async function updateUserInfo(req, res, next) {
    const { user_id, new_user_mail  } = req.body;

    if (!user_id || !new_user_mail) {
        return res.status(400).json(JSend.error({ message: 'Missing required fields' }));
    }

    try {
        const updated = await customer.updateUserInfo(user_id, new_user_mail );
        if (updated) {
            return res.json(JSend.success({ message: 'User information updated successfully' }));
        } else {
            return res.status(404).json(JSend.error({ message: 'User not found' }));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(JSend.error({ message: 'Error updating user information' }));
    }
}

// Order History API
// http://localhost:3000/customers/order_history/?id=3
async function getOrderHistory(req, res, next) {
    const customer_id = req.query.user_id;

    if (!customer_id) {
        return res.status(400).json(JSend.error({ message: 'Missing customer_id' }));
    }

    try {
        const orders = await customer.getInvoiceDetail(customer_id);
        if (!orders || orders.length === 0) {
            return res.status(404).json(JSend.error({ message: 'No orders found' }));
        }
        return res.json(JSend.success({ orders }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(JSend.error({ message: 'Error retrieving order history' }));
    }
}

async function getUserInfo(req, res, next) {
    const user_id = req.query.user_id;
    console.log('Requested user_id:', user_id);

    if (!user_id) {
        return res.status(400).json(JSend.error({ message: 'Missing user ID' }));
    }

    try {
        const userInfo = await customer.getUserInfo(user_id);
        console.log('Database result:', userInfo);
        
        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json(JSend.error({ message: 'User not found' }));
        }
        return res.json(JSend.success({ user: userInfo[0] }));
    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json(JSend.error({ message: 'Error retrieving user information' }));
    }
}

module.exports = {
    updateUserInfo,
    getOrderHistory,
    getUserInfo
};
