module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('payments', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: Sequelize.ENUM(
                    'cartão de débito',
                    'cartão de crédito',
                    'dinheiro'
                ),
                allowNull: false,
            },
            chance: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('payments');
    },
};
