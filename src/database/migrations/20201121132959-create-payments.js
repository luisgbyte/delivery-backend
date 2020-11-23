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
                type: Sequelize.ENUM('Cartão', 'Dinheiro'),
                allowNull: false,
            },
            chance: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            card_type: {
                type: Sequelize.ENUM('Débito', 'Crédito'),
                allowNull: true,
            },
            card_banner: {
                type: Sequelize.ENUM('Visa', 'MasterCard'),
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
