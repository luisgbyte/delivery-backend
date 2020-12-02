// import * as Yup from 'yup';
import Order from '../models/Order';
import Product from '../models/Product';
import Payment from '../models/Payment';
import Client from '../models/Client';

const { Op } = require('sequelize');

class OrderTrackerController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const order = await Order.findAll({
            where: {
                [Op.not]: [{ status: ['Entregue', 'Cancelado'] }],
            },
            attributes: ['id', 'total', 'created_at', 'status'],
            order: ['created_at'],
            limit: 10,
            offset: (page - 1) * 20,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name'],
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id', 'type'],
                },
            ],
        });

        return res.json(order);
    }
}

export default new OrderTrackerController();
