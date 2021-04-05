module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'payments',
            [
                {
                    type: 'cartão de crédito',
                    chance: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('payments', null, {});
    },
};
