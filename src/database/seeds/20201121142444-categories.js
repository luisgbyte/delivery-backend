module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'categories',
            [
                {
                    name: 'Hambúrgueres',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Sanduíche',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('categories', null, {});
    },
};
