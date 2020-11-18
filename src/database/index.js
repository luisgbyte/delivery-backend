import Sequelize from 'sequelize';

import Admin from '../app/models/Admin';
import Client from '../app/models/Client';
import Address from '../app/models/Address';
import Category from '../app/models/Category';

import databaseConfig from '../config/database';

const models = [Admin, Client, Address, Category];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
