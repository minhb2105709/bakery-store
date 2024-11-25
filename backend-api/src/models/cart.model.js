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
            .select('u.user_name', 'b.bread_name', 'id.quantity', 'id.cost', 'i.invoice_id', 'b.bread_url', 'b.bread_price', 'b.bread_id');
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
                return {success: false, message: 'Quantity unchanged' };
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
            });

            return {success: true, message: result ? 'Cart updated successfully' : 'No changes made' };
            
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }, 

    // Xoá sản phẩm khỏi giỏ hàng
    deleteItem: async function (userId, breadId) {
        let trx = null;
        try {
            // Tạo một giao dịch
            trx = await knex.transaction();

            // Kiểm tra hóa đơn chưa thanh toán của người dùng
            const invoiceRecord = await trx('invoice')
                .select('invoice_id')
                .where({ user_id: userId, status: 'chưa thanh toán' })
                .first();

            if (!invoiceRecord) {
                throw new Error('No unpaid invoice found for this user');
            }

            const invoiceId = invoiceRecord.invoice_id;

            // Kiểm tra sản phẩm trong chi tiết hóa đơn
            const existingItem = await trx('invoiceDetail')
                .select('quantity', 'cost')
                .where({ invoice_ID: invoiceId, bread_id: breadId })
                .first();

            if (!existingItem) {
                throw new Error('Product not found in the cart');
            }

            // Lấy thông tin sản phẩm trong kho
            const breadData = await trx('bread')
                .select('bread_amount')
                .where('bread_id', breadId)
                .first()
                .forUpdate();

            if (!breadData) {
                throw new Error('Product not found in stock');
            }

            // Xóa sản phẩm khỏi `invoiceDetail`
            await trx('invoiceDetail')
                .where({ invoice_ID: invoiceId, bread_id: breadId })
                .del();

            // Cập nhật lại số lượng sản phẩm trong kho
            const newBreadAmount = breadData.bread_amount + existingItem.quantity;
            await trx('bread')
                .where('bread_id', breadId)
                .update({ bread_amount: newBreadAmount });

            // Commit giao dịch
            await trx.commit();
            return { success: true, message: 'Product removed from cart successfully' };
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            // Rollback giao dịch nếu có lỗi
            if (trx) await trx.rollback();
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

    addToCart: async function (userId, breadId, br_amount) {
        const amount = Number(br_amount); 
        let trx = null;
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

                invoiceId = newInvoice[0]; // Extract ID from array
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
                .first()
                .forUpdate();

            if (!breadPriceData || breadPriceData.bread_amount < amount) {
                await trx.rollback();
                throw new Error('Product not found or insufficient stock');
            }

            if (existingItem) {
                // Convert existing quantity to a number before adding
                const newQuantity = Number(existingItem.quantity) + amount;
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
    },

    checkout: async function (userId, invoiceId) {
        let trx = null;
        try {
            // Tạo transaction để đảm bảo tính nhất quán của dữ liệu
            trx = await knex.transaction();

            // Kiểm tra xem invoice có tồn tại và thuộc về user không
            const invoice = await trx('invoice')
                .where({
                    'invoice_id': invoiceId,
                    'user_id': userId,
                    'status': 'chưa thanh toán'
                })
                .first();

            if (!invoice) {
                throw new Error('Invoice not found or already paid');
            }

            // Cập nhật trạng thái của invoice
            await trx('invoice')
                .where('invoice_id', invoiceId)
                .update({
                    'status': 'đã thanh toán',
                });

            // Commit transaction
            await trx.commit();

            return {
                success: true,
                message: 'Checkout completed successfully'
            };

        } catch (error) {
            // Rollback trong trường hợp có lỗi
            if (trx) await trx.rollback();
            console.error('Error during checkout:', error);
            throw error;
        }
    }


};

module.exports = cart;
