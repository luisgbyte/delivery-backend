module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            client_id: {
                type: Sequelize.INTEGER,
                references: { model: 'clients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM(
                    'Realizado',
                    'Confirmado',
                    'Cancelado',
                    'Pronto',
                    'Entregue'
                ),
                defaultValue: 'Realizado',
                allowNull: false,
            },
            payment_id: {
                type: Sequelize.INTEGER,
                references: { model: 'payments', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                defaultValue: Date.now(),
                allowNull: false,
            },
            total: {
                type: Sequelize.DOUBLE,
                allowNull: false,
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
        await queryInterface.dropTable('orders');
    },
};
