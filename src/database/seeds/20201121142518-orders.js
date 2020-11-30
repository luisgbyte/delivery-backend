module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'orders',
            [
                {
                    client_id: 1,
                    status: 'Realizado',
                    payment_id: 1,
                    total: 120,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('orders', null, {});
    },
};
