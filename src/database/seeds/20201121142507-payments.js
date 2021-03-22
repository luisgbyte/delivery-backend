module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'payments',
            [
                {
                    type: 'cartao_credito',
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
