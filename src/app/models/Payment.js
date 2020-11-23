import Sequelize, { Model } from 'sequelize';

class Payment extends Model {
    static init(sequelize) {
        super.init(
            {
                type: {
                    type: Sequelize.ENUM('Cartão', 'Dinheiro'),
                },
                chance: Sequelize.DOUBLE,
                card_type: {
                    type: Sequelize.ENUM('Débido', 'Crédito'),
                },
                card_banner: {
                    type: Sequelize.ENUM('Visa', 'MasterCard'),
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Payment;
