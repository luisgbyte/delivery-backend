module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'clients',
            [
                {
                    name: 'Luis',
                    email: 'lg@gmail.com',
                    password_hash:
                        '$2a$08$GCm9uNTwjLC9wASbLLq7P.sAg1szomjo6qYbagAgFEeaN3xhnoP3e',
                    cpf: '927.858.290-50',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('clients', null, {});
    },
};
