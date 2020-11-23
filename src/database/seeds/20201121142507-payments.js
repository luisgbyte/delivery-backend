module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'payments',
            [
                {
                    type: 'Cartão',
                    chance: 50,
                    card_type: 'Débito',
                    card_banner: 'Visa',
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
