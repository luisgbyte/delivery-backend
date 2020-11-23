// import * as Yup from 'yup';
import Order from '../models/Order';
import Product from '../models/Product';
import Payment from '../models/Payment';

const { Op } = require('sequelize');

class TrackerOrderController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const order = await Order.findAll({
            where: {
                client_id: req.userId,
                [Op.not]: [{ status: ['Entregue', 'Cancelado'] }],
            },
            attributes: ['id', 'total', 'date', 'status'],
            order: ['date'],
            limit: 10,
            offset: (page - 1) * 20,
            include: [
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

export default new TrackerOrderController();
