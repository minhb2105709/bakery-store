import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        selectedItems: [],
        cartTotal: 0
    }),
    getters: {
        getSelectedItems: (state) => state.selectedItems,
        getCartTotal: (state) => state.cartTotal
    },
    actions: {
        setSelectedItems(items) {
            this.selectedItems = items;
        },
        clearCart() {
            this.selectedItems = [];
            this.cartTotal = 0;
        }
    }
});