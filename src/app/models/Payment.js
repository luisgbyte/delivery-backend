import Sequelize, { Model } from 'sequelize';

class Payment extends Model {
    static init(sequelize) {
        super.init(
            {
                type: {
                    type: Sequelize.ENUM(
                        'cartão de crédito',
                        'cartão de débito',
                        'dinheiro'
                    ),
                },
                chance: Sequelize.DOUBLE,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Payment;
