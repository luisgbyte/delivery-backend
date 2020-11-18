import Sequelize, { Model } from 'sequelize';

class Address extends Model {
    static init(sequelize) {
        super.init(
            {
                city: Sequelize.STRING,
                neighborhood: Sequelize.STRING,
                street: Sequelize.STRING,
                number: Sequelize.STRING,
                cep: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }
}

export default Address;
