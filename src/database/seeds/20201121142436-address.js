module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'addresses',
            [
                {
                    city: 'Brasília',
                    neighborhood: 'Primavera',
                    street: 'Rua Null',
                    number: 126,
                    client_id: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('addresses', null, {});
    },
};
