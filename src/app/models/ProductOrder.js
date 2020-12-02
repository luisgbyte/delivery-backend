import Sequelize, { Model } from 'sequelize';

class ProductOrder extends Model {
    static init(sequelize) {
        super.init(
            {
                product_id: Sequelize.INTEGER,
                order_id: Sequelize.INTEGER,
                quantity: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default ProductOrder;
