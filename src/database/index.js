import Sequelize from 'sequelize';

import Admin from '../app/models/Admin';
import Client from '../app/models/Client';
import Address from '../app/models/Address';
import Category from '../app/models/Category';
import File from '../app/models/File';
import Product from '../app/models/Product';
import Order from '../app/models/Order';
import Payment from '../app/models/Payment';
import ProductOrder from '../app/models/ProductOrder';

import databaseConfig from '../config/database';

const models = [
    Admin,
    Client,
    Address,
    Category,
    File,
    Product,
    Order,
    Payment,
    ProductOrder,
];

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
