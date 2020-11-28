import Sequelize, { Model } from 'sequelize';

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.DOUBLE,
                description: Sequelize.STRING,
                stocked: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, {
            foreignKey: 'file_id',
            as: 'file',
        });

        this.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });

        this.belongsToMany(models.Order, {
            through: 'ProductOrders',
            as: 'order',
            foreignKey: 'product_id',
            otherKey: 'order_id',
        });
    }
}

export default Product;
