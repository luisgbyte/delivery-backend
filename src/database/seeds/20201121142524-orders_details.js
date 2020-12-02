module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'product_orders',
            [
                {
                    product_id: 1,
                    order_id: 1,
                    quantity: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    product_id: 2,
                    order_id: 1,
                    quantity: 3,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('product_orders', null, {});
    },
};
