import Sequelize, { Model } from 'sequelize';

class Order extends Model {
    static init(sequelize) {
        super.init(
            {
                total: Sequelize.DOUBLE,
                date: Sequelize.DATE,
                status: {
                    type: Sequelize.ENUM(
                        'Entregue',
                        'Realizado',
                        'Confirmado',
                        'Cancelado',
                        'Pronto'
                    ),
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Client, {
            foreignKey: 'client_id',
            as: 'client',
        });

        this.belongsToMany(models.Product, {
            through: 'ProductOrders',
            as: 'products',
            foreignKey: 'order_id',
            otherKey: 'product_id',
        });

        this.belongsTo(models.Payment, {
            foreignKey: 'payment_id',
            as: 'payment',
        });
    }
}

export default Order;
