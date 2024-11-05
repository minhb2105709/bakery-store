
const knex = require('../database/knex');

const customer = {
    updateUserInfo: function (user_id, new_user_name, new_user_mail) {
        return knex('userInfo')
            .where('user_id', user_id)
            .update({
                user_name: new_user_name,
                user_mail: new_user_mail
            });
    },


    getInvoiceDetail: function (customer_id) {
    let status = "đã thanh toán";
    return knex('invoiceDetail')
        .join('invoice', 'invoiceDetail.invoice_ID', 'invoice.invoice_ID')
        .join('bread', 'invoiceDetail.bread_id', 'bread.bread_id')
        .where('invoice.user_id', customer_id)  
        .andWhere('invoice.status', status)     
        .select('invoiceDetail.invoice_ID', 'bread.bread_name', 
            'invoiceDetail.quantity', 'invoiceDetail.cost', 
            'invoice.invoice_date', 'invoice.status');
    }
};

module.exports = customer;