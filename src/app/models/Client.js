import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                cpf: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async (client) => {
            if (client.password) {
                client.password_hash = await bcrypt.hash(client.password, 8);
            }
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    static associate(models) {
        this.hasOne(models.Address, {
            foreignKey: 'client_id',
            as: 'address',
        });
    }
}

export default Client;
