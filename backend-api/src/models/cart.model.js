const knex = require('../database/knex');

const cart = {
    // Xem giỏ hàng
    getCart: function (userId) {
        return knex('invoice as i')
            .where('i.user_id', userId)
            .andWhere('i.status', 'chưa thanh toán')
            .join('invoicedetail as id', 'i.invoice_id', 'id.invoice_id')
            .join('bread as b', 'id.bread_id', 'b.bread_id')
            .join('userinfo as u', 'i.user_id', 'u.user_id')
            .select('u.user_name', 'b.bread_name', 'id.quantity', 'id.cost');
    },

    // Cập nhật giỏ hàng
    updateCart: async function (userId, breadId, new_quantity) {
        try {
            // lấy giá bánh và số lượng còn lại trong kho
            const bread = await knex('bread')
                .select('bread_price', 'bread_amount')
                .where('bread_id', breadId)
                .first();

            if (!bread) {
                throw new Error('Bread not found');
            }

            // Kiểm tra nếu bread_price hoặc quantity không hợp lệ
            if (isNaN(bread.bread_price) || isNaN(new_quantity)) {
                throw new Error('Invalid bread price or quantity');
            }

            // Lấy số lượng hiện tại từ invoicedetail
            const currentDetail = await knex('invoicedetail')
                .join('invoice', 'invoicedetail.invoice_id', '=', 'invoice.invoice_id')
                .select('invoicedetail.quantity')
                .where({
                    'invoice.user_id': userId,
                    'invoicedetail.bread_id': breadId,
                    'invoice.status': 'chưa thanh toán'
                })
                .first();

            if (!currentDetail) {
                throw new Error('Invoice detail not found');
            }

            if (currentDetail.quantity === new_quantity) {
                return { updated: false, message: 'Quantity unchanged' };
            }


            // Tính toán sự chênh lệch và điều chỉnh số lượng bread
            let quantityDifference = new_quantity - currentDetail.quantity;
            let newBreadAmount = bread.bread_amount - quantityDifference;


            if (newBreadAmount < 0) {
                throw new Error('Not enough bread in stock');
            }

            const cost = new_quantity * bread.bread_price;

            // Cập nhật invoicedetail và bread
            const result = await knex.transaction(async trx => {
                const updatedRows = await trx('invoicedetail')
                    .join('invoice', 'invoicedetail.invoice_id', '=', 'invoice.invoice_id')
                    .where({
                        'invoice.user_id': userId,
                        'invoicedetail.bread_id': breadId,
                        'invoice.status': 'chưa thanh toán'
                    })
                    .update({
                        'invoicedetail.quantity': new_quantity,
                        'invoicedetail.cost': cost
                    });

                await trx('bread')
                    .where('bread_id', breadId)
                    .update({
                        'bread_amount': newBreadAmount
                    });

                return updatedRows > 0;
            });

            return { updated: result, message: result ? 'Cart updated successfully' : 'No changes made' };

        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }, 

    // Xoá sản phẩm khỏi giỏ hàng
    deleteItem: async function (userId, breadId) {
        try {
            // Lấy giá bánh và số lượng còn lại trong kho
            const bread = await knex('bread')
                .select('bread_amount')
                .where('bread_id', breadId)
                .first();

            if (!bread) {
                throw new Error('Bread not found');
            }

            // Lấy số lượng hiện tại từ invoicedetail
            const currentDetail = await knex('invoicedetail')
                .join('invoice', 'invoicedetail.invoice_id', '=', 'invoice.invoice_id')
                .select('invoicedetail.quantity')
                .where({
                    'invoice.user_id': userId,
                    'invoicedetail.bread_id': breadId,
                    'invoice.status': 'chưa thanh toán'
                })
                .first();

            if (!currentDetail) {
                throw new Error('Invoice detail not found');
            }

            // Tính số lượng mới của sản phẩm trong kho sau khi xoá khỏi giỏ hàng
            const newBreadAmount = bread.bread_amount + currentDetail.quantity;

            // Thực hiện xoá invoicedetail và cập nhật lại kho
            const result = await knex.transaction(async trx => {
                // Xoá sản phẩm khỏi giỏ hàng
                const deletedRows = await trx('invoicedetail')
                    .join('invoice', 'invoicedetail.invoice_id', '=', 'invoice.invoice_id')
                    .where({
                        'invoice.user_id': userId,
                        'invoicedetail.bread_id': breadId,
                        'invoice.status': 'chưa thanh toán'
                    })
                    .del();

                // Cập nhật lại số lượng trong kho
                await trx('bread')
                    .where('bread_id', breadId)
                    .update({
                        'bread_amount': newBreadAmount
                    });

                return deletedRows > 0;
            });

            return { deleted: result, message: result ? 'Product removed from cart and stock updated' : 'No changes made' };

        } catch (error) {
            console.error('Error deleting item from cart:', error);
            throw error;
        }
    },

    deleteAllItems: async function (userId) {
        try {
            // Lấy danh sách tất cả sản phẩm trong giỏ hàng của user
            const cartItems = await knex('invoicedetail')
                .join('invoice', 'invoicedetail.invoice_id', '=', 'invoice.invoice_id')
                .select('invoicedetail.bread_id', 'invoicedetail.quantity')
                .where({
                    'invoice.user_id': userId,
                    'invoice.status': 'chưa thanh toán'
                });

            if (cartItems.length === 0) {
                throw new Error('No items found in cart');
            }

            // Thực hiện transaction
            const result = await knex.transaction(async trx => {
                // Xóa tất cả sản phẩm trong giỏ hàng
                const deletedRows = await trx('invoicedetail')
                    .join('invoice', 'invoicedetail.invoice_id', '=', 'invoice.invoice_id')
                    .where({
                        'invoice.user_id': userId,
                        'invoice.status': 'chưa thanh toán'
                    })
                    .del();

                // Cập nhật số lượng trong kho cho từng sản phẩm trong giỏ hàng
                for (const item of cartItems) {
                    await trx('bread')
                        .where('bread_id', item.bread_id)
                        .increment('bread_amount', item.quantity); // Cộng lại số lượng vào kho
                }

                return deletedRows > 0;
            });

            return { deleted: result, message: result ? 'All items removed from cart and stock updated' : 'No changes made' };

        } catch (error) {
            console.error('Error deleting all items from cart:', error);
            throw error;
        }
    },

    addToCart: async function (userId, breadId) {
        const amount = 1; // default amount for adding to cart
        try {
            // Create a transaction instance
            const trx = await knex.transaction();

            // Retrieve or create an unpaid invoice
            let invoiceRecord = await trx('invoice')
                .select('invoice_id')
                .where({ user_id: userId, status: 'chưa thanh toán' })
                .first();

            let invoiceId;
            if (!invoiceRecord) {
                const newInvoice = await trx('invoice')
                    .insert({ user_ID: userId, invoice_date: knex.fn.now() })
                    .returning('invoice_ID');

                invoiceId = newInvoice[0];  // Extract ID from array
            } else {
                invoiceId = invoiceRecord.invoice_id;
            }

            // Check if the product already exists in the cart
            const existingItem = await trx('invoiceDetail')
                .select('quantity')
                .where({ invoice_ID: invoiceId, bread_id: breadId })
                .first();

            const breadPriceData = await trx('bread')
                .select('bread_price', 'bread_amount')
                .where('bread_id', breadId)
                .first();

            if (!breadPriceData || breadPriceData.bread_amount < amount) {
                await trx.rollback();
                throw new Error('Product not found or insufficient stock');
            }

            if (existingItem) {
                // Update quantity and cost for existing item
                const newQuantity = existingItem.quantity + amount;
                const newCost = breadPriceData.bread_price * newQuantity;
                await trx('invoiceDetail')
                    .where({ invoice_ID: invoiceId, bread_id: breadId })
                    .update({ quantity: newQuantity, cost: newCost });
            } else {
                // Insert new item into invoice detail
                await trx('invoiceDetail')
                    .insert({
                        invoice_ID: invoiceId,
                        bread_id: breadId,
                        quantity: amount,
                        cost: breadPriceData.bread_price * amount
                    });
            }

            // Update stock quantity
            await trx('bread')
                .where('bread_id', breadId)
                .update({ bread_amount: breadPriceData.bread_amount - amount });

            // Commit the transaction
            await trx.commit();
            return { success: true, message: 'Product added to cart successfully' };
        } catch (error) {
            console.error('Error adding product to cart:', error);
            // Only rollback if trx is defined
            if (trx) await trx.rollback();
            throw error;
        }
    }


};

module.exports = cart;