module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'addresses',
            [
                {
                    city: 'Arinos-mg',
                    neighborhood: 'Primavera1',
                    street: 'Rua tal',
                    number: 126,
                    cep: '38680-000',
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
