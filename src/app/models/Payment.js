import Sequelize, { Model } from 'sequelize';

class Payment extends Model {
    static init(sequelize) {
        super.init(
            {
                type: {
                    type: Sequelize.ENUM(
                        'cartao_credito',
                        'cartao_debito',
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
