module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'admins',
            [
                {
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    password_hash:
                        '$2a$08$GCm9uNTwjLC9wASbLLq7P.sAg1szomjo6qYbagAgFEeaN3xhnoP3e',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('admins', null, {});
    },
};
