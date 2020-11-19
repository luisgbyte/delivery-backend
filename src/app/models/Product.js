import Sequelize, { Model } from 'sequelize';

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.DOUBLE,
                description: Sequelize.STRING,
                stock: Sequelize.BOOLEAN,
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
    }
}

export default Product;
