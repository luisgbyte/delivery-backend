module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'products',
            [
                {
                    name: 'Hamburguer de siri',
                    price: 15,
                    description: 'médio',
                    stocked: true,
                    // file_id: ,
                    category_id: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Sanduíche de carne',
                    price: 10,
                    description: 'pequeno',
                    stocked: true,
                    // file_id: ,
                    category_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('products', null, {});
    },
};
